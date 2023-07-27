import React, { useEffect, useState, useRef } from 'react';
import { Html, OrbitControls } from '@react-three/drei';
import { CardBox } from '../../style';

export const Card = props => {
  return (
    <mesh>
      <Html position={[0, 0.05, -0.09]} transform occlude>
        <CardBox />
      </Html>
    </mesh>
  );
};
