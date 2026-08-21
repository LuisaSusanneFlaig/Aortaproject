import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from vtkmodules.util.numpy_support import vtk_to_numpy
from vtkmodules.vtkIOXML import vtkXMLImageDataReader


def read_volume(path):
    reader = vtkXMLImageDataReader()
    reader.SetFileName(str(path))
    reader.Update()
    image = reader.GetOutput()
    dimensions = image.GetDimensions()
    scalars = vtk_to_numpy(image.GetPointData().GetScalars())
    return scalars.reshape(dimensions[2], dimensions[1], dimensions[0])


def window_ct(slice_data, level=180, width=700):
    low = level - width / 2
    scaled = np.clip((slice_data - low) / width, 0, 1)
    return Image.fromarray((scaled * 255).astype(np.uint8), mode="L")


def axial(volume, index):
    return window_ct(np.flipud(volume[index, :, :]))


def coronal(volume, index):
    image = window_ct(np.flipud(volume[:, index, :]))
    return image.resize((image.width, round(image.height * 2.13)), Image.Resampling.BICUBIC)


def make_contact_sheet(items, target, columns=4):
    thumb_size = (280, 280)
    rows = int(np.ceil(len(items) / columns))
    sheet = Image.new("RGB", (columns * thumb_size[0], rows * 316), "#101010")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()

    for position, (label, image) in enumerate(items):
        column = position % columns
        row = position // columns
        preview = image.convert("RGB")
        preview.thumbnail(thumb_size, Image.Resampling.LANCZOS)
        x = column * thumb_size[0] + (thumb_size[0] - preview.width) // 2
        y = row * 316
        sheet.paste(preview, (x, y))
        draw.text((column * thumb_size[0] + 10, y + 286), label, fill="white", font=font)

    sheet.save(target, quality=94)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)

    volume = read_volume(args.source)
    axial_indices = [25, 50, 75, 100, 125, 150, 175, 200, 225]
    coronal_indices = [80, 120, 160, 200, 240, 280, 320, 360, 400, 440]

    make_contact_sheet(
        [(f"axial z={index}", axial(volume, index)) for index in axial_indices],
        args.output / "axial-contact.jpg",
    )
    make_contact_sheet(
        [(f"coronal y={index}", coronal(volume, index)) for index in coronal_indices],
        args.output / "coronal-contact.jpg",
    )

    axial(volume, 125).save(args.output / "alex_ct_axial.png")
    coronal(volume, 320).save(args.output / "alex_ct_coronal.png")


if __name__ == "__main__":
    main()
