import { CartForm } from '@shopify/hydrogen';

/**
 * Add to Cart button that includes "What's ur 20?" as a cart line attribute.
 *
 * @param {{
 *   variantId: string,
 *   quantity?: number,
 *   whatsUr20: string,
 *   disabled?: boolean,
 *   children?: React.ReactNode,
 * }} props
 */
export default function AddToCartButton({
    variantId,
    quantity = 1,
    whatsUr20,
    disabled = false,
    children,
}) {
    const isDisabled = disabled || !variantId || !whatsUr20?.trim();

    const lines = [
        {
            merchandiseId: variantId,
            quantity,
            attributes: [
                {
                    key: "What's ur 20?",
                    value: whatsUr20?.trim() || '',
                },
            ],
        },
    ];

    return (
        <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesAdd}
            inputs={{ lines }}
        >
            <button
                type="submit"
                className="btn-wacca"
                disabled={isDisabled}
                style={{
                    width: '100%',
                    fontSize: 15,
                    padding: '16px 32px',
                }}
            >
                {children || (
                    <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" />
                            <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Add to Cart
                    </>
                )}
            </button>
        </CartForm>
    );
}
