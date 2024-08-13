import { InfinitySpin } from "react-loader-spinner";

export function Loader({ className }) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
        <InfinitySpin color="orange" />
    </div>
  );
}
