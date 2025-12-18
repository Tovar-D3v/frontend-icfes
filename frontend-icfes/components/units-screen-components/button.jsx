import { Rate } from "antd";

export function ButtonUnits({ onClick, disabled, icon, completed }) {
  const src = completed
    ? "https://d35aaqx5ub95lt.cloudfront.net/images/path/icons/bfa591f6854b4de08e1656b3e8ca084f.svg"
    : disabled
    ? "https://d35aaqx5ub95lt.cloudfront.net/images/path/icons/9df8cee6fe91d35859cc7013d23e5d77.svg"
    : "https://d35aaqx5ub95lt.cloudfront.net/images/path/icons/7aa61c3f60bd961a60a46fb36e76c72f.svg";

  return (
    <button
      onClick={onClick}
      className={`w-20 h-20 rounded-full transition-all duration-100 flex items-center justify-center cursor-pointer ${
        disabled
          ? "bg-[#37464f] shadow-[0_10px_0_#2b3840] active:shadow-[0_3px_0_#2b3840] active:translate-y-[7px] hover:shadow-[0_6px_0_#2b3840] hover:translate-y-[4px]"
          : "bg-[#cc348d] shadow-[0_10px_0_#8c1e5a] active:shadow-[0_3px_0_#8c1e5a] active:translate-y-[7px] hover:shadow-[0_6px_0_#8c1e5a] hover:translate-y-[4px]"
      }`}
      disabled={disabled}
    >
      <img
        src={src}
        alt={completed ? "completed" : "icon"}
        className="w-10 h-10 select-none pointer-events-none "
      />
    </button>
  );
}
