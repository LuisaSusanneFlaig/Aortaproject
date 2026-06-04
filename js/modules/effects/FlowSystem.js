import * as THREE from 'three';

export class FlowSystem {
    constructor(settings) {
        this.settings = settings;
        this.dummy = new THREE.Object3D();
        this.colorHelper = new THREE.Color();
        this.vortexOffset = new THREE.Vector3();
        this._tempColor = new THREE.Color();
    }

    createSystem(flowObj, targetGroup, geometry = null) {
        if (flowObj.paths.length === 0) return;

        const s = this.settings.glyphSize;
        if (!geometry) {
            const type = this.settings.glyphType || 'Cone';
            switch (type) {
                case 'Sphere':
                    geometry = new THREE.SphereGeometry(s * 0.5, 8, 8);
                    break;
                case 'Box':
                    geometry = new THREE.BoxGeometry(s * 0.6, s * 0.6, s * 0.6);
                    break;
                case 'Arrow':
                    geometry = new THREE.ConeGeometry(s * 0.4, s * 1.5, 6);
                    geometry.rotateX(Math.PI * 0.5);
                    break;
                case 'Cone':
                default:
                    geometry = new THREE.ConeGeometry(s * 0.4, s * 1.5, 6);
                    geometry.rotateX(Math.PI * 0.5);
                    break;
            }
        }

        const material = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: this.settings.opacity || 0.8,
            depthWrite: false,
            depthTest: false,
            fog: false
        });

        flowObj.system = new THREE.InstancedMesh(geometry, material, this.settings.count);
        flowObj.system.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        flowObj.data = [];
        flowObj.frozen = !!flowObj.frozen;

        for (let i = 0; i < this.settings.count; i++) {
            const pIdx = Math.floor(Math.random() * flowObj.paths.length);
            const particle = {
                pIdx,
                u: Math.random(),
                radius: Math.random(),
                speed: (Math.random() * 0.4 + 0.1) * 0.005,
                randomOffset: new THREE.Vector3(
                    (Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)
                ).multiplyScalar(this.settings.spawnSpread),
                phase: Math.random() * Math.PI * 2,
                momentum: 0,
                frozenState: null
            };
            flowObj.data.push(particle);
        }
        targetGroup.add(flowObj.system);
    }

    updateFlow(flowObj, currentPulse = 1.0, settingsOverride = null) {
        if (!flowObj.system || flowObj.paths.length === 0) return;
        const settings = settingsOverride || this.settings;
        const isFrozen = !!flowObj.frozen;
        const timeSec = performance.now() * 0.001;
        const { system, data, paths } = flowObj;

        for (let i = 0; i < settings.count; i++) {
            const d = data[i];
            const path = paths[d.pIdx];

            if (isFrozen && d.frozenState) {
                this.dummy.position.copy(d.frozenState.position);
                this.dummy.quaternion.copy(d.frozenState.quaternion);
                this.dummy.scale.copy(d.frozenState.scale);
                this.dummy.updateMatrix();
                system.setMatrixAt(i, this.dummy.matrix);
                this.colorHelper.copy(d.frozenState.color);
                system.setColorAt(i, this.colorHelper);
                continue;
            }
            
            // Apply pulse and speed
            const profile = settings.laminarFactor ? (1.0 - (d.radius * d.radius * settings.laminarFactor)) : 1.0;
            const targetVelocity = d.speed * settings.speedMultiplier * currentPulse * profile * (settings.laminarFactor ? 2.5 : 1.0);
            
            if (settings.laminarFactor) {
                d.momentum = THREE.MathUtils.lerp(d.momentum, targetVelocity, 0.15);
                d.u += d.momentum;
            } else {
                d.u += targetVelocity;
            }

            if (d.u >= 1.0) {
                d.u = 0;
                d.pIdx = Math.floor(Math.random() * paths.length);
                if (settings.laminarFactor) d.radius = Math.random();
                
                d.speed = (Math.random() * 0.4 + 0.1) * 0.005;
                d.randomOffset.set(
                    (Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)
                ).multiplyScalar(settings.spawnSpread);
            }

            // Movement mode
            if (settings.moveMode === 'Spline') {
                path.curve.getPoint(d.u, this.dummy.position);
                const tangent = path.curve.getTangent(d.u);
                this.dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
            } 
            else if (settings.moveMode === 'Linear' || !settings.moveMode) {
                if (path.points && path.quats) {
                    const totalPoints = path.points.length;
                    const exactIdx = d.u * (totalPoints - 1);
                    const idxA = Math.floor(exactIdx);
                    const idxB = Math.min(idxA + 1, totalPoints - 1);
                    const alpha = exactIdx - idxA;
                    this.dummy.position.lerpVectors(path.points[idxA], path.points[idxB], alpha);
                    this.dummy.quaternion.slerpQuaternions(path.quats[idxA], path.quats[idxB], alpha);
                } else {
                    path.curve.getPoint(d.u, this.dummy.position);
                }
            }
            else if (settings.moveMode === 'Step') {
                const idx = Math.floor(d.u * (path.points.length - 1));
                this.dummy.position.copy(path.points[idx]);
                this.dummy.quaternion.copy(path.quats[idx]);
            }

            // Turbulence and Vortex
            if (settings.spawnSpread > 0 || settings.turbulence > 0) {
                this.dummy.position.add(d.randomOffset);
                this.dummy.position.x += Math.sin(timeSec * 2 + d.phase) * settings.turbulence;
                this.dummy.position.y += Math.cos(timeSec * 1.5 + d.phase) * settings.turbulence;
            }

            if (settings.vorticity) {
                const swirl = Math.sin(d.u * 20 + d.phase) * settings.vorticity * (1.0 - d.u);
                this.vortexOffset.set(
                    Math.sin(timeSec * 2 + d.phase) * swirl,
                    Math.cos(timeSec * 2 + d.phase) * swirl,
                    0
                );
                this.dummy.position.add(this.vortexOffset);
            }

            // Scaling
            let scaleMultiplier = 1.0;
            if (d.u < settings.fadeRange || d.u > (1.0 - settings.fadeRange)) scaleMultiplier = 0.0;

            if (settings.dynamicScaling) {
                const currentSpeed = settings.laminarFactor ? d.momentum : (d.speed * settings.speedMultiplier);
                const s = (1 + (currentSpeed * 1200)) * scaleMultiplier;
                this.dummy.scale.set(scaleMultiplier, scaleMultiplier, s);
            } else {
                this.dummy.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);
            }

            this.dummy.updateMatrix();
            system.setMatrixAt(i, this.dummy.matrix);
            
            // Color
            if (settings.colorMode === 'Velocity') {
                const vDisplay = (settings.laminarFactor ? d.momentum : d.speed * settings.speedMultiplier) * 800;
                this.applyVelocityColor(i, vDisplay, system);
            } else {
                this.colorHelper.set(settings.colorSlow);
                system.setColorAt(i, this.colorHelper);
            }

            d.frozenState = {
                position: this.dummy.position.clone(),
                quaternion: this.dummy.quaternion.clone(),
                scale: this.dummy.scale.clone(),
                color: this.colorHelper.clone()
            };
        }
        system.instanceMatrix.needsUpdate = true;
        system.instanceColor.needsUpdate = true;
    }

    setFrozen(flowObj, frozen) {
        if (!flowObj) return;
        flowObj.frozen = frozen;
        if (!frozen || !flowObj.data) return;
        flowObj.data.forEach((d) => {
            if (!d.frozenState) return;
            d.frozenState.position ||= new THREE.Vector3();
            d.frozenState.quaternion ||= new THREE.Quaternion();
            d.frozenState.scale ||= new THREE.Vector3(1, 1, 1);
            d.frozenState.color ||= new THREE.Color(this.settings.colorSlow);
        });
    }

    applyVelocityColor(index, v, system) {
        const colorStagnation = new THREE.Color("#0000ff");
        const colorNormal = new THREE.Color("#00ff44");
        const colorStress = new THREE.Color("#ff0000");

        if (v < 0.2) this.colorHelper.copy(colorStagnation).lerp(new THREE.Color(this.settings.colorSlow), v * 5);
        else if (v < 0.6) this.colorHelper.set(this.settings.colorSlow).lerp(colorNormal, (v - 0.2) * 2.5);
        else this.colorHelper.copy(colorNormal).lerp(new THREE.Color(this.settings.colorFast), Math.min((v - 0.6) * 2.5, 1));
        
        system.setColorAt(index, this.colorHelper);
    }
}
