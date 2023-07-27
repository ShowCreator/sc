import styled, { CSSObject } from '@emotion/styled';

export const CardBox = styled.div({
  backgroundColor: `rgba( 0, 127, 127, ${Math.random() * 0.5 + 0.25} )`,
  width: '120px',
  height: '160px',
  cursor: 'default',
  textAlign: 'center',
  border: '1px solid rgba( 127, 255, 255, 0.25 )',
  boxShadow: ' 0 0 12px rgba( 0, 255, 255, 0.5 )',
});
