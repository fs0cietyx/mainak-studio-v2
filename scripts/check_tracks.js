import fs from 'fs';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// We can't easily use GLTFLoader in bare Node without some setup.
// Let's just use grep on the RoboticArm.tsx to find group names again, or let's just strip 'roboarm001_low_0' in the React filter.
