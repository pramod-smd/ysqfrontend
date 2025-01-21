import Dashboard from "./components/dashboard/Dashboard";
import Brands from "./components/brands/Brands";
import Currencies from "./components/currency/Currencies";
import Warehouses from "./components/warehouse/Warehouses";
import CreateWarehouse from "./components/warehouse/CreateWarehouse";
import EditWarehouse from "./components/warehouse/EditWarehouse";
import ProductCategory from "./components/productCategory/ProductCategory";
import Units from "./components/units/Units";
import Suppliers from "./components/supplier/Suppliers";
import CreateSupplier from "./components/supplier/CreateSupplier";
import EditSupplier from "./components/supplier/EditSupplier";
import Customers from "./components/customer/Customers";
import CreateCustomer from "./components/customer/CreateCustomer";
import EditCustomer from "./components/customer/EditCustomer";
import User from "./components/users/User";
import CreateUser from "./components/users/CreateUser";
import EditUser from "./components/users/EditUser";
import UserDetail from "./components/users/UserDetail";
import UpdateProfile from "./components/user-profile/UpdateProfile";
import Product from "./components/product/Product";
import CreateProduct from "./components/product/CreateProduct";
import EditProduct from "./components/product/EditProduct";
import ProductDetail from "./components/product/ProductDetail";
import Settings from "./components/settings/Settings";
import ExpenseCategory from "./components/expense-category/ExpenseCategory";
import Expenses from "./components/expense/Expenses";
import CreateExpense from "./components/expense/CreateExpense";
import EditExpense from "./components/expense/EditExpense";
import Purchases from "./components/purchase/Purchases";
import CreatePurchase from "./components/purchase/CreatePurchase";
import EditPurchase from "./components/purchase/EditPurchase";
import PurchaseDetails from "./components/purchase/PurchaseDetails";
import PosMainPage from "./frontend/components/PosMainPage";
import PrintData from "./frontend/components/printModal/PrintData";
import Sales from "./components/sales/Sales";
import CreateSale from "./components/sales/CreateSale";
import EditSale from "./components/sales/EditSale";
import SaleReturn from "./components/saleReturn/SaleReturn";
import CreateSaleReturn from "./components/saleReturn/CreateSaleReturn";
import EditSaleReturn from "./components/saleReturn/EditSaleReturn";
import SaleReturnDetails from "./components/saleReturn/SaleReturnDetails";
import SaleDetails from "./components/sales/SaleDetails";
import PurchaseReturn from "./components/purchaseReturn/PurchaseReturn";
import CreatePurchaseReturn from "./components/purchaseReturn/CreatePurchaseReturn";
import EditPurchaseReturn from "./components/purchaseReturn/EditPurchaseReturn";
import PurchaseReturnDetails from "./components/purchaseReturn/PurchaseReturnDetails";
import WarehouseReport from "./components/report/warehouseReport/WarehouseReport";
import SaleReport from "./components/report/saleReport/SaleReport";
import StockReport from "./components/report/stockReport/StockReport";
import StockDetails from "./components/report/stockReport/StockDetails";
import TopSellingProductsReport from "./components/report/topSellingReport/TopSellingProductsReport";
import PurchaseReport from "./components/report/purchaseReport/PurchaseReport";
import PrintBarcode from "./components/printBarcode/PrintBarcode";
import { Permissions } from "./constants";
import Role from "./components/roles/Role";
import CreateRole from "./components/roles/CreateRole";
import EditRole from "./components/roles/EditRole";
import Adjustments from "./components/adjustments/Adjustments";
import CreateAdjustment from "./components/adjustments/CreateAdjustment";
import EditAdjustMent from "./components/adjustments/EditAdjustMent";
import WarehouseDetail from "./components/warehouse/WarehouseDetail";
import ProductQuantityReport from "./components/report/productQuantityReport/ProductQuantityReport";
import Transfers from "./components/transfers/Transfers";
import EditTransfer from "./components/transfers/EditTransfer";
import CreateTransfer from "./components/transfers/CreateTransfer";
import Prefixes from "./components/settings/Prefixes";
import SuppliersReport from "./components/report/supplier-report/SuppliersReport";
import SupplierReportDetails from "./components/report/supplier-report/SupplierReportDetails";
import EmailTemplates from "./components/Email-templates/EmailTemplates";
import EditEmailTemplate from "./components/Email-templates/EditEmailTemplate";
import Quotations from "./components/quotations/Quotations";
import CreateQuotation from "./components/quotations/CreateQuotation";
import EditQuotation from "./components/quotations/EditQuotation";
import CreateQuotationSale from "./components/quotations/CreateQuotationSale";
import QuotationDetails from "./components/quotations/QuotationDetails";
import MailSettings from "./components/settings/MailSettings";
import SmsTemplates from "./components/sms-templates/SmsTemplates";
import EditSmsTemplate from "./components/sms-templates/EditSmsTemplate";
import BestCustomerReport from "./components/report/best-customerReport/BestCustomerReport";
import ProfitLossReport from "./components/report/ProfitLossReport/ProfitLossReport";
import CustomerReportDetails from "./components/report/customer-report/CustomerReportDetails";
import CustomersReport from "./components/report/customer-report/CustomersReport";
import SmsApi from "./components/sms-api/SmsApi";
import EditSaleReturnFromSale from "./components/saleReturn/EditSaleReturnFromSale";
import Language from "./components/languages/Language";
import EditLanguageData from "./components/languages/EditLanguageData";
import BaseUnits from "./components/base-unit/BaseUnits";
import RegisterReport from "./components/report/registerReport/RegisterReport";
import Variation from "./components/variation/Variation";
import ReceiptSettings from "./components/settings/ReceiptSettings";

import Distributor from "./components/distributor/Distributor";
import CreateDistributor from "./components/distributor/CreateDistributor";
import EditDistributor from "./components/distributor/EditDistributor";
import DistributorDetails from "./components/distributor/DistributorDetails";
import Region from "./components/region/Region";
import Area from "./components/area/Area";
import SubmitedGifts from "./components/gifts/SubmitedGifts";
import Gifts from "./components/gifts/Gifts";
import Allcashlist from "./components/cash/AllCashList";
import Mileage from "./components/mileage/Mileage";
import MileageDetails from "./components/mileage/MileageDetails";
import AsignCash from "./components/cash/AsignCash";
import Stock from "./components/inventory/Stock";
import AddInventory from "./components/inventory/AddInventory";
import UpdateInventoryPrice from "./components/inventory/UpdateInventoryPrice";
import Chanel from "./components/chanel/Chanel";
import Supervisor from "./components/Supervisor/Supervisor";
import CreateSupervisor from "./components/Supervisor/CreateSupervisor";
import EditSupervisor from "./components/Supervisor/EditSupervisor";
import SupervisorDetails from "./components/Supervisor/SupervisorDetails";
import Salesman from "./components/salesman/Salesman";
import CreateSalesman from "./components/salesman/CreateSalesman";
import EditSalesman from "./components/salesman/EditSalesman";
import SalesmanDetails from "./components/salesman/SalesmanDetails";
import Createchanel from "./components/chanel/Createchanel";
import EditChanel from "./components/chanel/EditChanel";
import CreateArea from "./components/area/CreateArea";
import EditArea from "./components/area/EditArea";
import Coupon from "./components/coupon/Coupon";
import CreateCoupon from "./components/coupon/CreateCoupon";
import EditCoupon from "./components/coupon/EditCoupon";
import Add from "./components/gifts/Add";
import EditGift from "./components/gifts/EditGift";
import GiftDetails from "./components/gifts/GiftDetails";
import PosLoadMainPage from "./frontend/components/PosLoadMainPage";
import AssignCustomer from "./components/assign-customer/AssignCustomer";
import AssignCustomerList from "./components/assign-customer/AssignCustomerList";
import PosLoadGift from "./components/loadGift/PosLoadGift";
import PosLoadGiftList from "./components/loadGift/PosLoadGiftList";
import PosLoadProductList from "./components/loadProduct/PosLoadProductList";
import CustomerDetails from "./components/customer/CustomerDetails";
import StockOutList from "./components/loadProduct/StockOutList";
import StockOut from "./components/loadProduct/StockOut";
import Question from "./components/survey/Question";
import AddQuestion from "./components/survey/AddQuestion";
import SurveyList from "./components/survey/SurveyList";
import SurveyDetails from "./components/survey/SurveyDetails";
import SubmitedGiftDetails from "./components/gifts/SubmitedGiftDetails";
import CheckIn from "./components/checkin/CheckIn";
import CheckOut from "./components/checkin/CheckOut";
import EditQuestion from "./components/survey/EditQuestion";
import QuestionDetail from "./components/survey/QuestionDetail";
import Collection from "./components/credit-collection/Collection";
import GiftInventory from "./components/inventory/GiftInventory";
import GiftInventoryCheckout from "./components/inventory/GiftInventoryCheckout";
import SalesmanTracker from "./components/assign-customer/SalesmanTracker";
import AssignedCustomersDetails from "./components/assign-customer/AssignedCustomersDetails";
import LanguageContent from "./components/languages/LanguageContent";
import LanguageContentForm from "./components/languages/LanguageContentForm";
import EditLanguageContent from "./components/languages/EditLanguageContent";
import CountryList from "./components/country/CountryList";
import NotificationTemplates from "./components/notification-templates/NotificationTemplates";
import EditNotificationTemplate from "./components/notification-templates/EditNotificationTemplate";
import CreateNotificationTemplate from "./components/notification-templates/createNotificationTemplate";
import CheckInDetails from "./components/checkin/CheckInDetails";
import CheckOutDetails from "./components/checkin/CheckOutDetails";
import UserNotificationList from "./components/notification-templates/UserNotificationList";
import UserNotificationEdit from "./components/notification-templates/UserNotificationEdit";
import AdminNotificationTemplate from "./components/notification-templates/AdminNotificationTemplate";
import AdminNotificationTemplateList from "./components/notification-templates/AdminNotificationTemplateList";
import EditAdminNotificationTemplate from "./components/notification-templates/EditAdminNotificationTemplate";
import SubArea from "./components/area/SubArea";
import AddSubArea from "./components/area/AddSubArea";
import EditSubArea from "./components/area/EditSubArea";
import AllSalesmanTracker from "./components/salesman/AllSalesmanTracker";
import AddEmailTemplate from "./components/Email-templates/AddEmailTemplate";
import AddAdminEmailTemplate from "./components/notification-templates/AddAdminEmailTemplate";
import AdminEmailTemplate from "./components/notification-templates/AdminEmailTemplate";
import EditAdminEmailTemplate from "./components/notification-templates/EditAdminEmailTemplate";
import SaleReturnReport from "./components/report/saleReturnReport/SaleReturnReport";
import GiftReport from "./components/report/giftReport/GiftReport";
import CashAssignReport from "./components/report/cash-assign-report/CashAssignReport";
import MileageReport from "./components/report/mileage-report/MileageReport";
import ProductReports from "./components/report/productReport/ProductReports";
import ProductsDetailsReport from "./components/report/productReport/ProductsDetailsReport";
import GiftStock from "./components/report/stockReport/GiftStock";
import GiftStockDetails from "./components/report/stockReport/GiftStockDetails";
export const route = [
    {
        path: "dashboard",
        ele: <Dashboard />,
        permission: Permissions.MANAGE_DASHBOARD,
    },
    {
        path: "brands",
        ele: <Brands />,
        permission: Permissions.MANAGE_BRANDS,
    },
    {
        path: "currencies",
        ele: <Currencies />,
        permission: Permissions.MANAGE_CURRENCY,
    },
    {
        path: "warehouse",
        ele: <Warehouses />,
        permission: Permissions.MANAGE_WAREHOUSES,
    },
    {
        path: "warehouse/create",
        ele: <CreateWarehouse />,
        permission: Permissions.MANAGE_WAREHOUSES,
    },
    {
        path: "warehouse/edit/:id",
        ele: <EditWarehouse />,
        permission: Permissions.MANAGE_WAREHOUSES,
    },
    {
        path: "warehouse/detail/:id",
        ele: <WarehouseDetail />,
        permission: Permissions.MANAGE_WAREHOUSES,
    },
    {
        path: "product-categories",
        ele: <ProductCategory />,
        permission: Permissions.MANAGE_PRODUCT_CATEGORIES,
    },
    {
        path: "variations",
        ele: <Variation />,
        permission: Permissions.MANAGE_VARIATIONS,
    },

    {
        path: "units",
        ele: <Units />,
        permission: Permissions.MANAGE_UNITS,
    },
    {
        path: "base-units",
        ele: <BaseUnits />,
        permission: Permissions.MANAGE_UNITS,
    },
    {
        path: "suppliers",
        ele: <Suppliers />,
        permission: Permissions.MANAGE_SUPPLIERS,
    },
    {
        path: "suppliers/create",
        ele: <CreateSupplier />,
        permission: Permissions.MANAGE_SUPPLIERS,
    },
    {
        path: "suppliers/edit/:id",
        ele: <EditSupplier />,
        permission: Permissions.MANAGE_SUPPLIERS,
    },
    {
        path: "customers",
        ele: <Customers />,
        permission: Permissions.MANAGE_CUSTOMERS,
    },
    {
        path: "customers/create",
        ele: <CreateCustomer />,
        permission: Permissions.CREATE_CUSTOMER,
    },
    {
        path: "customers/edit/:id",
        ele: <EditCustomer />,
        permission: Permissions.EDIT_CUSTOMER,
    },
    {
        path: "users",
        ele: <User />,
        permission: Permissions.MANAGE_ADMIN,
    },
    {
        path: "distributor",
        ele: <Distributor />,
        permission: Permissions.MANAGE_DISTRIBUTORS,
    },
    {
        path: "distributor/edit/:id",
        ele: <EditDistributor />,
        permission: Permissions.EDIT_DISTRIBUTOR,
    },
    {
        path: "distributor/create",
        ele: <CreateDistributor />,
        permission: Permissions.CREATE_DISTRIBUTOR,
    },
    {
        path: "users/create",
        ele: <CreateUser />,
        permission: Permissions.CREATE_ADMIN,
    },
    {
        path: "users/edit/:id",
        ele: <EditUser />,
        permission: Permissions.EDIT_ADMIN,
    },
    {
        path: "users/detail/:id",
        ele: <UserDetail />,
        permission: Permissions.MANAGE_ADMIN,
    },
    {
        path: "distributors/detail/:id",
        ele: <DistributorDetails />,
        permission: Permissions.MANAGE_DISTRIBUTORS,
    },
    {
        path: "profile/edit",
        ele: <UpdateProfile />,
        permission: "",
    },
    {
        path: "products",
        ele: <Product />,
        permission: Permissions.MANAGE_PRODUCTS,
    },
    {
        path: "products/create",
        ele: <CreateProduct />,
        permission: Permissions.CREATE_PRODUCT,
    },
    {
        path: "products/edit/:id",
        ele: <EditProduct />,
        permission: Permissions.EDIT_PRODUCT,
    },
    {
        path: "products/detail/:id",
        ele: <ProductDetail />,
        permission: Permissions.MANAGE_PRODUCTS,
    },
    {
        path: "adjustments",
        ele: <Adjustments />,
        permission: Permissions.MANAGE_ADJUSTMENTS,
    },
    {
        path: "adjustments/create",
        ele: <CreateAdjustment />,
        permission: Permissions.MANAGE_ADJUSTMENTS,
    },
    {
        path: "adjustments/:id",
        ele: <EditAdjustMent />,
        permission: Permissions.MANAGE_ADJUSTMENTS,
    },
    {
        path: "settings",
        ele: <Settings />,
        permission: Permissions.MANAGE_SETTING,
    },
    {
        path: "prefixes",
        ele: <Prefixes />,
        permission: Permissions.MANAGE_SETTING,
    },
    {
        path: "mail-settings",
        ele: <MailSettings />,
        permission: Permissions.MANAGE_SETTING,
    },
    {
        path: "receipt-settings",
        ele: <ReceiptSettings />,
        permission: Permissions.MANAGE_SETTING,
    },
    {
        path: "expense-categories",
        ele: <ExpenseCategory />,
        permission: Permissions.MANAGE_EXPENSES_CATEGORIES,
    },
    {
        path: "expenses",
        ele: <Expenses />,
        permission: Permissions.MANAGE_EXPENSES,
    },
    {
        path: "expenses/create",
        ele: <CreateExpense />,
        permission: Permissions.MANAGE_EXPENSES,
    },
    {
        path: "expenses/edit/:id",
        ele: <EditExpense />,
        permission: Permissions.MANAGE_EXPENSES,
    },
    {
        path: "purchases",
        ele: <Purchases />,
        permission: Permissions.MANAGE_PURCHASE,
    },
    {
        path: "purchases/create",
        ele: <CreatePurchase />,
        permission: Permissions.MANAGE_PURCHASE,
    },
    {
        path: "purchases/edit/:id",
        ele: <EditPurchase />,
        permission: Permissions.MANAGE_PURCHASE,
    },
    {
        path: "purchases/detail/:id",
        ele: <PurchaseDetails />,
        permission: Permissions.MANAGE_PURCHASE,
    },
    {
        path: "pos",
        ele: <PosMainPage />,
        permission: Permissions.MANAGE_POS_SCREEN,
    },
    {
        path: "/payment",
        ele: <PrintData />,
        permission: "",
    },
    {
        path: "user-detail",
        ele: <UserDetail />,
        permission: Permissions.MANAGE_USER,
    },
    {
        path: "all-sales",
        ele: <Sales />,
        permission: Permissions.MANAGE_SALE,
    },
    {
        path: "sales/create",
        ele: <CreateSale />,
        permission: Permissions.MANAGE_SALE,
    },
    {
        path: "sales/edit/:id",
        ele: <EditSale />,
        permission: Permissions.MANAGE_SALE,
    },
    {
        path: "sales/return/:id",
        ele: <CreateSaleReturn />,
        permission: Permissions.MANAGE_SALE_RETURN,
    },
    {
        path: "sales/return/edit/:id",
        ele: <EditSaleReturnFromSale />,
        permission: Permissions.MANAGE_SALE_RETURN,
    },
    {
        path: "quotations",
        ele: <Quotations />,
        permission: Permissions.MANAGE_QUOTATION,
    },
    {
        path: "quotations/create",
        ele: <CreateQuotation />,
        permission: Permissions.MANAGE_QUOTATION,
    },
    {
        path: "quotations/edit/:id",
        ele: <EditQuotation />,
        permission: Permissions.MANAGE_QUOTATION,
    },
    {
        path: "quotations/Create_sale/:id",
        ele: <CreateQuotationSale />,
        permission: Permissions.MANAGE_QUOTATION,
    },
    {
        path: "quotations/detail/:id",
        ele: <QuotationDetails />,
        permission: Permissions.MANAGE_QUOTATION,
    },
    {
        path: "sale-return",
        ele: <SaleReturn />,
        permission: Permissions.MANAGE_SALE_RETURN,
    },
    {
        path: "sale-return/edit/:id",
        ele: <EditSaleReturn />,
        permission: Permissions.MANAGE_SALE_RETURN,
    },
    {
        path: "sale-return/detail/:id",
        ele: <SaleReturnDetails />,
        permission: Permissions.MANAGE_SALE_RETURN,
    },
    {
        path: "all-sales/details/:id",
        ele: <SaleDetails />,
        permission: Permissions.MANAGE_SALE,
    },
    {
        path: "purchase-return",
        ele: <PurchaseReturn />,
        permission: Permissions.MANAGE_PURCHASE_RETURN,
    },
    {
        path: "purchase-return/create",
        ele: <CreatePurchaseReturn />,
        permission: Permissions.MANAGE_PURCHASE_RETURN,
    },
    {
        path: "purchase-return/edit/:id",
        ele: <EditPurchaseReturn />,
        permission: Permissions.MANAGE_PURCHASE_RETURN,
    },
    {
        path: "purchase-return/detail/:id",
        ele: <PurchaseReturnDetails />,
        permission: Permissions.MANAGE_PURCHASE_RETURN,
    },
    {
        path: "report/report-warehouse",
        ele: <WarehouseReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-sale",
        ele: <SaleReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-return-sale",
        ele: <SaleReturnReport/>,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-gift",
        ele: <GiftReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-cash-assign",
        ele: <CashAssignReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-mileage",
        ele: <MileageReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-products",
        ele: <ProductReports />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-stock",
        ele: <StockReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-inventory-gifts",
        ele: <GiftStock />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-detail-stock/:id",
        ele: <StockDetails />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-inventory-gifts-details/:id",
        ele: <GiftStockDetails />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-detail-product/:id",
        ele: <ProductsDetailsReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-top-selling-products",
        ele: <TopSellingProductsReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-product-quantity",
        ele: <ProductQuantityReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/report-purchase",
        ele: <PurchaseReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/suppliers",
        ele: <SuppliersReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/profit-loss",
        ele: <ProfitLossReport />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "report/suppliers/details/:id",
        ele: <SupplierReportDetails />,
        permission: Permissions.MANAGE_REPORTS,
    },
    {
        path: "print/barcode",
        ele: <PrintBarcode />,
        permission: Permissions.MANAGE_PRODUCTS,
    },
    {
        path: "roles",
        ele: <Role />,
        permission: Permissions.MANAGE_ROLES,
    },
    {
        path: "roles/create",
        ele: <CreateRole />,
        permission: Permissions.MANAGE_ROLES,
    },
    {
        path: "roles/edit/:id",
        ele: <EditRole />,
        permission: Permissions.MANAGE_ROLES,
    },
    {
        path: "transfers",
        ele: <Transfers />,
        permission: Permissions.MANAGE_TRANSFERS,
    },
    {
        path: "transfers/create",
        ele: <CreateTransfer />,
        permission: Permissions.MANAGE_TRANSFERS,
    },
    {
        path: "transfers/:id",
        ele: <EditTransfer />,
        permission: Permissions.MANAGE_TRANSFERS,
    },
    {
        path: "email-templates",
        ele: <EmailTemplates />,
        permission: Permissions.MANAGE_EMAIL_TEMPLATES,
    },
    {
        path: "email-templates/add",
        ele: <AddEmailTemplate />,
        permission: Permissions.CREATE_EMAIL_TEMPLATES,
    },
    {
        path: "admin-email-templates/add",
        ele: <AddAdminEmailTemplate />,
        permission: Permissions.CREATE_ADMIN_EMAIL_TEMPLATE,
    },
    {
        path: "admin-email-templates",
        ele: <AdminEmailTemplate />,
        permission: Permissions.MANAGE_ADMIN_EMAIL_TEMPLATE,
    },
    {
        path: "admin-email-templates/edit/:id",
        ele: <EditAdminEmailTemplate />,
        permission: Permissions.EDIT_ADMIN_EMAIL_TEMPLATE,
    },

    {
        path: "email-templates/:id",
        ele: <EditEmailTemplate />,
        permission: Permissions.MANAGE_EMAIL_TEMPLATES,
    },
    {
        path: "sms-templates",
        ele: <SmsTemplates />,
        permission: Permissions.MANAGE_SMS_TEMPLATES,
    },
    {
        path: "sms-templates/:id",
        ele: <EditSmsTemplate />,
        permission: Permissions.MANAGE_SMS_TEMPLATES,
    },
    {
        path: "report/best-customers",
        ele: <BestCustomerReport />,
        permission: "",
    },
    {
        path: "report/customers",
        ele: <CustomersReport />,
        permission: "",
    },
    {
        path: "report/customers/details/:id",
        ele: <CustomerReportDetails />,
        permission: "",
    },
    {
        path: "report/register",
        ele: <RegisterReport />,
        permission: "",
    },
    {
        path: "sms-api",
        ele: <SmsApi />,
        permission: Permissions.MANAGE_SMS_API,
    },
    {
        path: "languages",
        ele: <Language />,
        permission: Permissions.MANAGE_LANGUAGES,
    },
    {
        path: "languages/:id",
        ele: <EditLanguageData />,
        permission: Permissions.MANAGE_LANGUAGES,
    },
    {
        path: "region",
        ele: <Region />,
        permission: Permissions.MANAGE_REGION,
    },
    {
        path: "area",
        ele: <Area />,
        permission: Permissions.MANAGE_AREA,
    },
    {
        path: "area/create",
        ele: <CreateArea />,
        permission: Permissions.CREATE_AREA,
    },
    {
        path: "sub-area",
        ele: <SubArea />,
        permission: Permissions.MANAGE_AREA,
    },
    {
        path: "sub-area-add",
        ele: <AddSubArea />,
        permission: Permissions.MANAGE_AREA,
    },

    {
        path:"sub-area-edit/:id",
        ele:<EditSubArea />,
        permission: Permissions.MANAGE_AREA,
    },

    {
        path: "gifts",
        ele: <Gifts />,
        permission: Permissions.MANAGE_GIFTS,
    },
    {
        path: "gift-history",
        ele: <SubmitedGifts />,
        permission: Permissions.MANAGE_GIFT_HISTORY,
    },
    {
       path:"gift-inventory",
       ele:<GiftInventory />,
       permission: Permissions.MANAGE_GIFT_INVENTORY,
    },

    {
        path:"gift-inventory-checkout/:id",
        ele:<GiftInventoryCheckout />,
        permission: Permissions.MANAGE_GIFT_INVENTORY,
    },

    {
        path: "all-cash-list",
        ele: <Allcashlist />,
        permission: Permissions.MANAGE_CASH,
    },
    {
        path: "all-cash-list/asign-cash",
        ele: <AsignCash />,
        permission: Permissions.ASIGN_CASH,
    },
    {
        path: "mileage-records",
        ele: <Mileage />,
        permission: Permissions.MANAGE_MILEAGE,
    },
    {
        path: "chanels",
        ele: <Chanel />,
        permission: Permissions.MANAGE_CHANNEL,
    },
    {
        path: "chanels/create",
        ele: <Createchanel />,
        permission: Permissions.CREATE_CHANNEL,
    },
    {
        path: "supervisor",
        ele: <Supervisor />,
        permission: Permissions.MANAGE_SUPERVISOR,
    },
    {
        path: "supervisor/create",
        ele: <CreateSupervisor />,
        permission: Permissions.CREATE_SUPERVISOR,
    },
    {
        path: "salesman/create",
        ele: <CreateSalesman />,
        permission: Permissions.CREATE_SALESMAN,
    },

    {
        path: "supervisor/edit/:id",
        ele: <EditSupervisor />,
        permission: Permissions.EDIT_SUPERVISOR,
    },

    {
        path: "mileage-records-details/:id",
        ele: <MileageDetails />,
        permission: Permissions.MANAGE_MILEAGE,
    },
    {
        path: "chanels",
        ele: <Chanel />,
        permission: Permissions.MANAGE_CHANNEL,
    },
    {
        path: "salesman/edit/:id",
        ele: <EditSalesman />,
        permission: Permissions.EDIT_SALESMAN,
    },
    {
        path: "supervisor/detail/:id",
        ele: <SupervisorDetails />,
        permission: Permissions.MANAGE_SUPERVISOR,
    },
    {
        path: "salesman",
        ele: <Salesman />,
        permission: Permissions.MANAGE_SALESMAN,
    },
    {
        path: "salesman/detail/:id",
        ele: <SalesmanDetails />,
        permission: Permissions.MANAGE_SALESMAN,
    },
    {
        path: "chanels/edit/:id",
        ele: <EditChanel />,
        permission: Permissions.EDIT_CHANNEL,
    },
    {
        path: "inventory",
        ele: <Stock />,
        permission: Permissions.MANAGE_INVENTORY,
    },
    {
        path: "inventory/create-stock/:id",
        ele: <AddInventory />,
        permission: Permissions.MANAGE_DASHBOARD,
    },
    {
        path: "inventory/update-inventory-price/:id",
        ele: <UpdateInventoryPrice />,
        permission: Permissions.MANAGE_DASHBOARD,
    },
    {
        path: "area/edit/:id",
        ele: <EditArea />,
        permission: Permissions.EDIT_AREA,
    },
    {
        path: "coupons",
        ele: <Coupon />,
        permission: Permissions.MANAGE_COUPON,
    },
    {
        path: "coupons/create",
        ele: <CreateCoupon />,
        permission: Permissions.CREATE_COUPON,
    },
    {
        path: "coupons/edit/:id",
        ele: <EditCoupon />,
        permission: Permissions.EDIT_COUPON,
    },
    {
        path: "gifts-add",
        ele: <Add />,
        permission: Permissions.CREATE_GIFT,
    },
    {
        path: "gifts/edit/:id",
        ele: <EditGift />,
        permission: Permissions.EDIT_GIFT,
    },
    {
        path: "gifts/detail/:id",
        ele: <GiftDetails />,
        permission: Permissions.MANAGE_GIFTS,
    },
    {
        path:"checkin-details/:id",
        ele: <CheckInDetails />,
        permission:Permissions.MANAGE_CHECKIN
    },
    {
        path:"checkout-details/:id",
        ele: <CheckOutDetails />,
        permission:Permissions.MANAGE_CHECKOUT
    },
    {
        path: "load",
        ele: <PosLoadMainPage />,
        permission: Permissions.ASSIGN_PRODUCT,
    },
    {
        path: "load-gift",
        ele: <PosLoadGift />,
        permission: Permissions.STOCKIN_GIFT,
    },
    {
        path: "assigned-gift-list",
        ele: <PosLoadGiftList />,
        permission:Permissions.MANAGE_STOCKIN_GIFT,
    },
    {
        path: "assign-customer-list/assign",
        ele: <AssignCustomer />,
        permission: Permissions.ASSIGN_CUSTOMER,
    },

    {
        path: "assign-customer-list",
        ele: <AssignCustomerList />,
        permission: Permissions.MANAGE_ASSIGNED_CUSTOMER,
    },
    {
        path:"assign-product-list",
        ele: <PosLoadProductList />,
        permission: Permissions.MANAGE_STOCKIN_PRODUCT,
    },
    {
        path: "customers/detail/:id",
        ele: <CustomerDetails />,
        permission: Permissions.MANAGE_CUSTOMERS,
    },
    {
        path: "stockout-product-list",
        ele: <StockOutList />,
        permission: Permissions.MANAGE_STOCKOUT_PRODUCT,
    },
    {
        path: "stockout-product-list/stockout",
        ele: <StockOut />,
        permission: Permissions.STOCKOUT_PRODUCT,
    },
    {
        path: "survey",
        ele: <SurveyList />,
        permission: Permissions.MANAGE_SURVEY,
    },
    {
        path: "question",
        ele: <Question />,
        permission: Permissions.MANAGE_QUESTION,
    },
    {
        path: "question-add",
        ele: <AddQuestion />,
        permission: Permissions.CREATE_QUESTION,
    },
    {
        path: "question-edit/:id",
        ele: <EditQuestion />,
        permission: Permissions.EDIT_QUESTION,
    },

    {
        path: "question-details/:id",
        ele: <QuestionDetail  />,
        permission: Permissions.MANAGE_QUESTION,
    },

    {
        path: "survey-details/:id",
        ele: <SurveyDetails />,
        permission: Permissions.MANAGE_SURVEY,
    },
    {
        path: "gift-history-details/:id",
        ele: <SubmitedGiftDetails />,
        permission: Permissions.MANAGE_GIFT_HISTORY,
    },
    {
        path: "checkin",
        ele: <CheckIn />,
        permission: Permissions.MANAGE_CHECKIN,
    },
    {
        path: "checkout",
        ele: <CheckOut />,
        permission: Permissions.MANAGE_CHECKOUT,
    },
    {
        path: "collections",
        ele: <Collection />,
        permission: Permissions.MANAGE_CREDIT_COLLECTION,
    },
    {
        path: "track-salesman/:id/:assined_id",
        ele: <SalesmanTracker />,
        permission: Permissions.MANAGE_DASHBOARD,
    },
    {
        path: "assing-customers-details/:id",
        ele: <AssignedCustomersDetails />,
        permission: Permissions.MANAGE_DASHBOARD,
    },


    {
        path: "language-contents",
        ele: <LanguageContent/>,
        permission: Permissions.MANAGE_LANGUAGE_CONTENT,
    },

    {
        path:"language-contents-add",
        ele:<LanguageContentForm />,
        permission: Permissions.CREATE_LANGUAGE_CONTENT,
    },

    {
        path:"language-contents-edit/:id",
        ele:<EditLanguageContent />,
        permission: Permissions.EDIT_LANGUAGE_CONTENT,
    },

    {
        path:"country",
        ele:<CountryList />,
        permission: Permissions.MANAGE_COUNTRY,
    },
    {
        path: "notification-templates",
        ele: <NotificationTemplates />,
        permission: Permissions.MANAGE_USER_NOTIFICATION_TEMPLATE,
    },
    {
        path: "user-notification-templates/create",
        ele: <CreateNotificationTemplate />,
        permission: Permissions.CREATE_USER_NOTIFICATION_TEMPLATE,
    },
    {
        path: "notification-templates/:id",
        ele: <EditNotificationTemplate />,
        permission: Permissions.EDIT_USER_NOTIFICATION_TEMPLATE,
    },
    {
        path:"user-notification-templates",
        ele:<UserNotificationList />,
        permission: Permissions.MANAGE_USER_NOTIFICATION_TEMPLATE,
    },
    {
        path: "user-notification-templates/:id",
        ele:<UserNotificationEdit />,
        permission: Permissions.EDIT_USER_NOTIFICATION_TEMPLATE,
    },
    {
        path: "admin-notification-templates/create",
        ele: < AdminNotificationTemplate />,
        permission: Permissions.CREATE_ADMIN_NOTIFICATION_TEMPLATE,
    },

    {
        path:"admin-notification-templates",
        ele:<AdminNotificationTemplateList />,
        permission: Permissions.MANAGE_ADMIN_NOTIFICATION_TEMPLATE,
    },

    {
        path: "admin-notification-templates/edit/:id",
        ele:<EditAdminNotificationTemplate />,
        permission: Permissions.EDIT_ADMIN_NOTIFICATION_TEMPLATE,
    },

    {
        path: "track-all-salesman",
        ele: <AllSalesmanTracker />,
        permission: Permissions.MANAGE_TRACK_SALESMAN,
    },
];
