const ProductButton = ({count, onIncrement, onDecrement}) => {
    return (
        <div className="flex items-center border my-4 space-x-4 w-[135px]">
            <button onClick={onDecrement} disabled={count <= 1} className={`px-5 py-2 ${count <= 1 ? 'opacity-50 cursor-not-allowed' : 'bg-primary text-white'}`} > - </button>
            <span className="text-sm">{count}</span>
            <button onClick={onIncrement} disabled={count >= 10} className={`px-5 py-2 ${count >= 10 ? 'opacity-50 cursor-not-allowed' : 'bg-primary text-white'}`} > + </button>
        </div>
    );
};

export default ProductButton;