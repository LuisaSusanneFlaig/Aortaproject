import base64
import json
import math
import struct
import zlib
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'story_images'
W, H, SCALE = 1100, 1500, 2
BG = (248, 245, 236)
INK = (35, 47, 53)
MUTED = (99, 112, 116)
PALE = (210, 218, 215)
RED = (173, 48, 30)
CORAL = (233, 125, 99)
GOLD = (212, 150, 73)


def font(size, bold=False):
    candidates = [
        'C:/Windows/Fonts/Georgia.ttf' if not bold else 'C:/Windows/Fonts/georgiab.ttf',
        'C:/Windows/Fonts/arial.ttf' if not bold else 'C:/Windows/Fonts/arialbd.ttf',
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size * SCALE)
        except OSError:
            pass
    return ImageFont.load_default()


def glb_geometry(path):
    data = path.read_bytes()
    json_len = struct.unpack_from('<I', data, 12)[0]
    gltf = json.loads(data[20:20 + json_len])
    bin_start = 20 + json_len + 8
    positions_acc = gltf['accessors'][0]
    index_acc = gltf['accessors'][-1]
    pv = gltf['bufferViews'][positions_acc['bufferView']]
    iv = gltf['bufferViews'][index_acc['bufferView']]
    positions = np.frombuffer(data, dtype='<f4', count=positions_acc['count'] * 3,
                              offset=bin_start + pv.get('byteOffset', 0)).reshape(-1, 3).copy()
    indices = np.frombuffer(data, dtype='<u4', count=index_acc['count'],
                            offset=bin_start + iv.get('byteOffset', 0)).reshape(-1, 3).copy()
    return positions, indices


def miriam_geometry(path):
    gltf = json.loads(path.read_text())
    blob = base64.b64decode(gltf['buffers'][0]['uri'].split(',', 1)[1])
    meshes = []
    for mesh in gltf['meshes']:
        primitive = mesh['primitives'][0]
        pa = gltf['accessors'][primitive['attributes']['POSITION']]
        ia = gltf['accessors'][primitive['indices']]
        pv, iv = gltf['bufferViews'][pa['bufferView']], gltf['bufferViews'][ia['bufferView']]
        positions = np.frombuffer(blob, dtype='<f4', count=pa['count'] * 3,
                                  offset=pv.get('byteOffset', 0) + pa.get('byteOffset', 0)).reshape(-1, 3).copy()
        index_type = {5121: 'u1', 5123: '<u2', 5125: '<u4'}[ia['componentType']]
        index_blob = blob if iv['buffer'] == 0 else base64.b64decode(
            gltf['buffers'][iv['buffer']]['uri'].split(',', 1)[1]
        )
        indices = np.frombuffer(index_blob, dtype=index_type, count=ia['count'],
                                offset=iv.get('byteOffset', 0) + ia.get('byteOffset', 0)).astype(np.int64)
        if primitive.get('mode', 4) == 4:
            indices = indices.reshape(-1, 3)
        else:
            indices = indices.reshape(-1, 1)
        meshes.append((positions, indices))
    return meshes


def project_mesh(positions, indices, yaw=0.0, pitch=0.0, pad=120):
    cy, sy = math.cos(yaw), math.sin(yaw)
    cp, sp = math.cos(pitch), math.sin(pitch)
    rot_y = np.array([[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]])
    rot_x = np.array([[1, 0, 0], [0, cp, -sp], [0, sp, cp]])
    points = (positions - positions.mean(axis=0)) @ rot_y.T @ rot_x.T
    xs, zs = points[:, 0], points[:, 2]
    scale = min((W - 2 * pad) / np.ptp(xs), (H - 2 * pad - 180) / np.ptp(zs))
    px = (xs - (xs.min() + xs.max()) / 2) * scale + W / 2
    py = H * 0.52 - (zs - (zs.min() + zs.max()) / 2) * scale
    return np.column_stack([px, py]), points, scale


def draw_mesh(canvas, positions, indices, yaw=0.0, pitch=0.0, fill=RED, alpha=255):
    xy, rotated, _ = project_mesh(positions, indices, yaw, pitch)
    z = rotated[:, 2]
    faces = indices
    depth = z[faces].mean(axis=1)
    order = np.argsort(depth)
    d = ImageDraw.Draw(canvas, 'RGBA')
    for face_id in order:
        pts = [tuple(np.rint(xy[v] * SCALE).astype(int)) for v in faces[face_id]]
        a, b, c = rotated[faces[face_id]]
        normal = np.cross(b - a, c - a)
        norm = np.linalg.norm(normal) or 1
        light = abs(normal[1] / norm) * 0.32 + max(0, normal[2] / norm) * 0.38 + 0.3
        k = max(0.7, min(1.12, light))
        color = tuple(max(0, min(255, round(ch * k))) for ch in fill)
        d.polygon(pts, fill=(*color, alpha))


def fit_text(draw, xy, text, fnt, fill):
    draw.text((int(xy[0] * SCALE), int(xy[1] * SCALE)), text, font=fnt, fill=fill)


def label(draw, point, text, side='right', width=125):
    x, y = point
    edge = x + width if side == 'right' else x - width
    elbow = x + (30 if side == 'right' else -30)
    draw.line([(int(x*SCALE), int(y*SCALE)), (int(elbow*SCALE), int((y-18)*SCALE)),
               (int(edge*SCALE), int((y-18)*SCALE))], fill=(*GOLD, 240), width=3*SCALE)
    anchor = 'lm' if side == 'right' else 'rm'
    draw.text((int(edge*SCALE), int((y-18)*SCALE)), text, font=font(16, True), fill=INK, anchor=anchor)


def draw_header(image, person, subtitle, tag):
    d = ImageDraw.Draw(image, 'RGBA')
    d.rounded_rectangle((60*SCALE, 50*SCALE, 250*SCALE, 89*SCALE), radius=18*SCALE,
                        fill=(231, 219, 198, 255))
    fit_text(d, (78, 60), tag.upper(), font(14, True), INK)
    fit_text(d, (60, 125), person, font(48, True), INK)
    fit_text(d, (62, 190), subtitle, font(20), MUTED)
    d.line([(60*SCALE, 225*SCALE), (1040*SCALE, 225*SCALE)], fill=(*PALE, 255), width=2*SCALE)


def footer(image, caption):
    d = ImageDraw.Draw(image, 'RGBA')
    d.line([(60*SCALE, 1350*SCALE), (1040*SCALE, 1350*SCALE)], fill=(*PALE, 255), width=2*SCALE)
    fit_text(d, (62, 1374), caption, font(15), MUTED)
    fit_text(d, (62, 1422), 'Patient-specific geometry • Illustrative reconstruction', font(13), MUTED)


def axon_bg(image, person, subtitle, tag):
    image.paste(BG, (0, 0, W*SCALE, H*SCALE))
    d = ImageDraw.Draw(image, 'RGBA')
    # A quiet vertical anatomical field, echoing an editorial medical plate.
    d.rounded_rectangle((285*SCALE, 270*SCALE, 815*SCALE, 1285*SCALE), radius=260*SCALE,
                        fill=(241, 237, 224, 255), outline=(*PALE, 230), width=2*SCALE)
    draw_header(image, person, subtitle, tag)


def alex_art():
    image = Image.new('RGBA', (W*SCALE, H*SCALE), BG)
    axon_bg(image, 'Alex', 'Thoracic aorta • aneurysmal enlargement', 'Case 01 / Aneurysm')
    d = ImageDraw.Draw(image, 'RGBA')
    pos, idx = glb_geometry(ROOT / 'assets/models/alex_aneurysm_aorta_0021.glb')
    # Slightly oblique view keeps the mesh's own curvature legible.
    yaw, pitch = 0.48, 0.25
    draw_mesh(image, pos, idx, yaw, pitch, RED, 250)
    xy, rot, _ = project_mesh(pos, idx, yaw, pitch)
    # Mark the broadest thoracic level as a restrained halo, calculated from the mesh.
    widths = []
    for q in np.linspace(0.2, 0.77, 70):
        zq = np.quantile(rot[:, 2], q)
        band = xy[np.abs(rot[:, 2] - zq) < np.ptp(rot[:, 2]) * 0.018]
        if len(band) > 10:
            widths.append((np.ptp(band[:, 0]), zq, band[:, 0].mean(), band[:, 1].mean()))
    widest = max(widths, key=lambda v: v[0])
    _, _, cx, cy = widest
    d.ellipse((int((cx-68)*SCALE), int((cy-52)*SCALE), int((cx+68)*SCALE), int((cy+52)*SCALE)),
              outline=(*GOLD, 210), width=2*SCALE)
    label(d, (cx+70, cy), 'Widened segment', 'right', 150)
    label(d, (390, 500), 'Ascending aorta', 'left', 145)
    label(d, (690, 790), 'Descending aorta', 'right', 155)
    # Mesh-based dimensions as visual brackets, not a clinical measurement.
    fit_text(d, (67, 300), 'CTA-DERIVED\nSURFACE', font(14, True), MUTED)
    d.line([(150*SCALE, 300*SCALE), (245*SCALE, 300*SCALE)], fill=(*GOLD, 220), width=2*SCALE)
    d.ellipse((235*SCALE, 292*SCALE, 251*SCALE, 308*SCALE), fill=(*GOLD, 255))
    footer(image, 'One 3D view of Alex’s aortic surface; proportions are illustrative.')
    return image


def miriam_art():
    image = Image.new('RGBA', (W*SCALE, H*SCALE), BG)
    axon_bg(image, 'Miriam', 'Aorta before dissection • single-channel anatomy', 'Case 02 / Before')
    d = ImageDraw.Draw(image, 'RGBA')
    meshes = miriam_geometry(ROOT / 'assets/models/miriam_pre_dissection_aorta.gltf')
    # mesh0 is the translucent outer wall; mesh1 is the model centerline; mesh2 a branch.
    yaw, pitch = -0.32, 0.08
    wall_pos, wall_idx = meshes[0]
    draw_mesh(image, wall_pos, wall_idx, yaw, pitch, CORAL, 170)
    # The embedded centerline and branch assets are unordered line segments.
    # Keep only the reconstructed aortic wall for this single-channel plate.
    label(d, (410, 540), 'Aortic arch', 'left', 120)
    label(d, (685, 840), 'Descending aorta', 'right', 155)
    label(d, (430, 735), 'Single lumen', 'left', 125)
    fit_text(d, (67, 300), 'PRE-EVENT\nGEOMETRY', font(14, True), MUTED)
    d.line([(160*SCALE, 300*SCALE), (255*SCALE, 300*SCALE)], fill=(*GOLD, 220), width=2*SCALE)
    d.ellipse((245*SCALE, 292*SCALE, 261*SCALE, 308*SCALE), fill=(*GOLD, 255))
    footer(image, 'Miriam’s pre-dissection mesh; it does not depict the later tear or false lumen.')
    return image


for name, artwork in [('alex_aorta_illustration.png', alex_art()),
                      ('miriam_aorta_illustration.png', miriam_art())]:
    target = OUT / name
    artwork.convert('RGB').resize((W, H), Image.Resampling.LANCZOS).save(target)
    print(f'Wrote {target}')
