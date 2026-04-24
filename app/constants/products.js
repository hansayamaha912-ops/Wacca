export const products = [
    {
        id: "angr-kun-main",
        handle: "angr-kun-main",
        title: "Angr-kun (Main)",
        description: "The core aggressive loyalty unit. Built for urban navigators.",
        cameraAngle: 0,
        availableForSale: true,
        priceRange: {
            minVariantPrice: { amount: "120.00", currencyCode: "USD" }
        },
        images: {
            nodes: [{ url: "/assets/images/products/angr-kun-pro-angle.jpg", altText: "Angr-kun" }]
        },
        hud: {
            typeId: "A-01",
            name: "Angr-kun",
            personality: "Aggressive but Loyal",
            status: "SCANNING... I'm ready"
        }
    },
    {
        id: "angr-kun-side",
        handle: "angr-kun-side",
        title: "Shadow Form",
        description: "An analytic profile variant for deep synchronization.",
        cameraAngle: Math.PI / 4,
        availableForSale: true,
        priceRange: {
            minVariantPrice: { amount: "145.00", currencyCode: "USD" }
        },
        images: {
            nodes: [{ url: "/logo-wacca-transparent.png", altText: "Shadow Form" }]
        },
        hud: {
            typeId: "A-02",
            name: "Shadow Form",
            personality: "Analytic Profile",
            status: "STANDBY"
        }
    },
    {
        id: "angr-kun-back",
        handle: "angr-kun-back",
        title: "Back Drive",
        description: "The dormant legacy unit. Awaiting system command.",
        cameraAngle: Math.PI / 1.5,
        availableForSale: false,
        priceRange: {
            minVariantPrice: { amount: "90.00", currencyCode: "USD" }
        },
        images: {
            nodes: [{ url: "/logo-wacca-transparent.png", altText: "Back Drive" }]
        },
        hud: {
            typeId: "A-03",
            name: "Back Drive",
            personality: "Dormant",
            status: "AWAITING COMMAND"
        }
    }
];

export const WACCA_PRODUCTS = products;
