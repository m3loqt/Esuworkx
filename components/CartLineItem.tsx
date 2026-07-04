import type { CartItem } from "@/lib/cart-context";
import { formatPrice } from "@/lib/product";

export default function CartLineItem({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="cart_item">
      {item.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="cart_item_img" src={item.image} alt={item.name} />
      ) : (
        <div className="cart_item_img" />
      )}
      <div className="cart_item_info">
        <div className="cart_item_name">{item.name}</div>
        <div className="cart_item_price">{formatPrice(item.price)} each</div>
        {onQuantityChange ? (
          <div className="cart_qty_stepper">
            <button
              type="button"
              className="cart_qty_btn"
              onClick={() => onQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              −
            </button>
            <span>{item.quantity}</span>
            <button
              type="button"
              className="cart_qty_btn"
              onClick={() => onQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.maxQuantity}
            >
              +
            </button>
          </div>
        ) : (
          <div className="cart_item_price">Qty {item.quantity}</div>
        )}
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontWeight: 700, fontSize: 13 }}>
          {formatPrice(String(Number(item.price) * item.quantity))}
        </div>
        {onRemove && (
          <button type="button" className="cart_remove" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
