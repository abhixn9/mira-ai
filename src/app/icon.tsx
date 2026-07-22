import { ImageResponse } from 'next/og';
 
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '50%',
          fontWeight: 900,
          fontFamily: 'sans-serif',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        M
      </div>
    ),
    {
      ...size,
    }
  );
}
