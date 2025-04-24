declare module 'react-katex' {
    import * as React from 'react';
  
    export interface InlineMathProps {
      math: string;
      errorColor?: string;
      renderError?: (error: Error) => React.ReactNode;
    }
  
    export class InlineMath extends React.Component<InlineMathProps> {}
  
    export interface BlockMathProps extends InlineMathProps {}
  
    export class BlockMath extends React.Component<BlockMathProps> {}
  }