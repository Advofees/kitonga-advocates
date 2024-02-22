export function ScaleButton({ text = "", className = "", onClick = () => {}, disabled = false, as="button" }) {

    return (
        <button disabled={disabled} type={as} onClick={onClick} className={`hover:scale-110 hover:shadow-lg hover:shadow-black duration-200 px-2 py-1 rounded disabled:cursor-not-allowed shadow shadow-black relative ${className}`}>{text}</button>
    )
}