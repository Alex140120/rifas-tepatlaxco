import { ProgressSpinner } from "primereact/progressspinner";

export default function Spinner() {
  return (
    <ProgressSpinner
      style={{ width: "50px", height: "50px", background: 'none' }}
      strokeWidth="4"
      animationDuration="1.5s"
      aria-label="Loading"
    />
  );
}
