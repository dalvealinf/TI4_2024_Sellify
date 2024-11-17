import * as Notifications from 'expo-notifications';

export const checkAndNotifyProducts = async (products) => {
  try {
    const lowStockProducts = [];
    const expiringProducts = [];

    // First, collect all products that need notifications
    products.forEach((product) => {
      // Stock check
      if (product.stock <= 10) {
        lowStockProducts.push(`${product.nombre} (${product.stock} unidad/es)`);
      }

      // Expiration check
      if (product.fecha_vencimiento) {
        const expDate = new Date(product.fecha_vencimiento);
        const today = new Date();
        const daysUntilExpiration = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiration <= 7 && daysUntilExpiration > 0) {
          expiringProducts.push(`${product.nombre} (${daysUntilExpiration} día/s)`);
        }
      }
    });

    // Send consolidated low stock notification
    if (lowStockProducts.length > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Productos con Stock Bajo",
          body: `Productos con poco stock:\n${lowStockProducts.join('\n')}`,
        },
        trigger: null,
      });
    }

    // Send consolidated expiring products notification
    if (expiringProducts.length > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Productos por Vencer",
          body: `Productos próximos a vencer:\n${expiringProducts.join('\n')}`,
        },
        trigger: null,
      });
    }

  } catch (error) {
    console.error('Error in checkAndNotifyProducts:', error);
  }
};