# Street Vendor Ordering System - Implementation TODO

## Completed (0/18)

## In Progress

## Pending Steps
1. ✅ **Extend vendors.js**: Added ownerMobile to each vendor. File updated.

2. ✅ **Update AuthContext.jsx**: Added role support to login/register funcs.
3. ✅ **Create CartContext.jsx**: Cart state, add/remove/update, localStorage persistence.
4. ✅ **Create OrdersContext.jsx**: Global orders, placeOrder, status updates.

5. ✅ **Update App.jsx**: Added Cart/OrdersProviders, new routes, fixed JSX structure. Full content overwritten for correctness.

6. ✅ **Rename Dashboard.jsx → UserDashboard.jsx**: Added role check, orders/cart integration.

7. **Create CartIcon.jsx** (Navbar component).

8. **Update Navbar.jsx**: Add Cart link/icon with badge, role-based nav.

9. **Update VendorDetail.jsx**: Add 'Add to Cart' buttons to menu items.

10. **Create Cart.jsx** (/cart page): View/edit cart, checkout → placeOrder.

11. **Create VendorLogin.jsx** (/vendor-login): Like Login but role='vendor'.

12. **Create VendorDashboard.jsx** (/vendor-dashboard): List vendor orders, accept/reject.

13. **Test user flow**: Login → VendorDetail → cart → checkout.

14. **Test vendor flow**: Vendor login → dashboard → manage orders.

15. **Update styles**: New CSS files matching existing design.

16. **Navbar updates**: Conditional rendering based on auth.role.

17. **Error handling**: Empty cart, no orders, auth guards.

18. **Final test & cleanup**: `npm run dev`, verify all flows.

**Legend**: ✅ Done | 🔄 In Progress | ⏳ Pending
