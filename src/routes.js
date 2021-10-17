import AdminRoot               from './pages/Admin/AdminRoot.vue'
import AdminSubscribers        from './pages/Admin/AdminSubscribers.vue'
import AdminSubscriptions      from './pages/Admin/AdminSubscriptions.vue'
import AdminReferrals          from './pages/Admin/AdminReferrals.vue'
import AdminReferrers          from './pages/Admin/AdminReferrers.vue'
import AdminPayments           from './pages/Admin/AdminPayments.vue'
import AddPackage              from './components/Packages/AddPackage.vue'
import AvailablePackages       from './pages/AvailablePackages.vue'
import BookSlot                from './pages/BookSlot.vue'
import Dashboard               from './pages/Dashboard.vue'
import ManageSubPros           from './pages/ManageSubPro.vue'
import ManageSubProsResister   from './components/SubPro/Register.vue'
import ManageStaff             from './pages/ManageStaff.vue'
import Login                   from './components/Auth/Login.vue'
import Register                from './components/Auth/Register.vue'
import BookingDetails          from './pages/BookingDetails.vue'
import Customers               from './pages/Customers.vue'
import CustomerDetails         from './pages/CustomerDetails.vue'
import PackageDetails          from './pages/PackageDetails.vue'
import PackageOrderDetails     from './pages/PackageOrderDetails.vue'
import PackageSlots            from './pages/PackageSlots.vue'
import PublicCalendar          from './pages/PublicCalendar.vue'
import PublicProductsPage      from './pages/PublicProducts.vue'
import ProductOptions          from './pages/ProductWizard/ProductOptions.vue'
import SlotDetails             from './pages/SlotDetails.vue'
import WizardSelectOngoingTime from './pages/SlotWizard/SelectOngoingTime.vue'
import WizardSelectImage       from './pages/SlotWizard/SelectPromoImage.vue'
import WizardConfirmProduct    from './pages/ProductWizard/ConfirmProduct.vue'
import PaymentSettings         from './pages/PaymentSettings.vue'
import ProductsPage            from './pages/Products.vue'
import ProductDetailsPage      from './pages/ProductDetails.vue'
import ProductChatPage         from './pages/ProductChat.vue'
import MyPurchasesPage         from './pages/MyPurchases.vue'
import MyManagers              from './components/MyManagers.vue'
import ManageDashboard         from './components/ManageDashboard.vue'
import ManagePros              from './components/ManagePros.vue'
import InviteList              from './pages/InviteList.vue'
import MyAutoBooks             from './pages/MyAutoBooks.vue'
import AutoBook                from './pages/AutoBook.vue'
import EmbedCode               from './pages/EmbedCode.vue'
import Request                 from './pages/Request.vue'
import CustomEmail             from './pages/CustomEmail.vue'
import LocationList            from './pages/LocationList.vue'
import EditLocation            from './pages/EditLocation.vue'
import Subscription            from './pages/Subscription.vue'
import ChoosePlan              from './pages/ChoosePlan.vue'
import ProFaq                  from './pages/ProFaq.vue'
import CustomerFaq             from './pages/CustomerFaq.vue'
import TutorialVideos          from './pages/TutorialVideos.vue'
import Referrals               from './pages/Referrals.vue'
import CalendarSync            from './pages/CalendarSync.vue'
import WizardUploadImages      from './pages/SlotWizard/UploadImages.vue'
import Account                 from './pages/Account.vue'
import AccountSettings         from './pages/AccountSettings.vue'
import PageNotFound            from './pages/PageNotFound.vue'
import EmployeeProfileDetails  from "./pages/EmployeeProfileDetails.vue";
import EmployeeUpdateProfile  from "./pages/EmployeeUpdateProfile.vue";
import AppChangeLog  from "./pages/AppChangeLog.vue";

function routes(app) {
    return [
        {path: '/admin', component: AdminRoot, name: 'adminRoot', meta: {title: ''}},
        {path: '/admin/subscribers', component: AdminSubscribers, name: 'adminSubscribers', meta: {title: ''}},
        {path: '/admin/subscriptions', component: AdminSubscriptions, name: 'adminSubscriptions', meta: {title: ''}},
        {path: '/admin/referrals', component: AdminReferrals, name: 'adminReferrals', meta: {title: ''}},
        {path: '/admin/referrers', component: AdminReferrers, name: 'adminReferrers', meta: {title: ''}},
        {path: '/admin/payments', component: AdminPayments, name: 'adminPayments', meta: {title: ''}},

        {path: '/', component: Dashboard, name: 'root', meta: {title: 'Login'}},
        {path: '/login', component: Login, name: 'login', meta: {title: 'Login', public: true}},
        {path: '/register', component: Register, name: 'register', meta: {title: 'Register', public: true}},
        {path: '/account', component: Account, name: 'account', meta: {title: 'Account'}},
        {
            path     : '/account-settings',
            component: AccountSettings,
            name     : 'accountSettings',
            meta     : {title: 'Account Settings§§'}
        },
        {path: '/dashboard', component: app.component('dashboard-page'), name: 'dashboard', meta: {title: 'Dashboard'}},
        {path: '/manage-sub-pro', component: ManageSubPros, name: 'manageSubPros', meta: {title: 'Manage Sub Pros'}},
        {
            path     : '/manage-sub-pro/register',
            component: ManageSubProsResister,
            name     : 'manageSubProsResister',
            meta     : {title: 'Manage Sub Pros Resister'}
        },
        {path: '/manage-staff', component: ManageStaff, name: 'manageStaff', meta: {title: 'Manage Staff'}},
        {
            path     : '/employee-profile-details',
            component: EmployeeProfileDetails,
            name     : 'employeeProfileDetails',
            meta     : {title: 'Employee Profile Details'}
        },
        {
            path     : '/employee-update-profile',
            component: EmployeeUpdateProfile,
            name     : 'employeeUpdateProfile',
            meta     : {title: 'Employee Update Profile'}
        }, {
            path     : '/app-change-log',
            component: AppChangeLog,
            name     : 'appChangeLog',
            meta     : {title: 'App Change Log'}
        },
        {path: '/slot/list', component: app.component('slot-list-page'), name: 'slotList', meta: {title: 'Time Slots'}},
        {
            path     : '/slot/details/:slotId',
            component: SlotDetails,
            name     : 'slotDetails',
            meta     : {title: 'Slots Details', protected: 'pro'}
        },
        {
            path     : '/event/list',
            component: app.component('event-list-page'),
            name     : 'eventList',
            meta     : {title: 'Event Types'}
        },
        {
            path     : '/time-slots-package',
            component: app.component('packages-page'),
            name     : 'packageDashboard',
            meta     : {title: 'My Packages'}
        },
        {path: '/calendar/private', component: app.component('private-calendar-page'), meta: {title: 'Calendar'}},
        {
            path     : '/payment-history',
            component: app.component('payment-history-page'),
            name     : 'payment-history',
            meta     : {title: 'Payment History'}
        },
        {
            path     : '/payment-settings',
            component: PaymentSettings,
            name     : 'paymentSettings',
            meta     : {title: 'Payment Settings'}
        },
        {path: '/customers', component: Customers, name: 'customers', meta: {title: 'Customers'}},
        {
            path     : '/customers/:userId',
            component: CustomerDetails,
            name     : 'customerDetails',
            meta     : {title: 'Customer Details'}
        },
        {
            path     : '/book/:publicId',
            component: PublicCalendar,
            name     : 'publicCalendar',
            meta     : {title: 'Time Slot Calendar'}
        },
        {
            path     : '/booking/confirm-slot/:id/:packageOrderId?',
            component: BookSlot,
            name     : 'bookSlot',
            meta     : {title: 'Confirm Slot', public: true}
        },
        {
            path     : '/booking/details/:bookingId',
            component: BookingDetails,
            name     : 'bookingDetails',
            meta     : {title: 'Booking Details'}
        },
        {
            path     : '/booking/list',
            component: app.component('my-bookings-page'),
            name     : 'bookingList',
            meta     : {title: 'My Bookings'}
        },
        {
            path     : '/booking/video',
            component: app.component('my-video-bookings-page'),
            name     : 'myVideoBookings',
            meta     : {title: 'My Video Bookings'}
        },
        {
            path     : '/package/orders',
            component: app.component('my-packages-page'),
            name     : 'packageOrders',
            meta     : {title: 'My Packages'}
        },
        {path: '/package/add', component: AddPackage, name: 'addPackage', meta: {title: 'Add Package'}},
        {path: '/package/edit/:packageId', component: AddPackage, name: 'editPackage', meta: {title: 'Edit Package'}},
        {
            path     : '/package/events/:packageOrderId',
            component: PackageSlots,
            name     : 'packageSlots',
            meta     : {title: 'Package Slots'}
        },
        {
            path     : '/package/pro/:publicId',
            component: AvailablePackages,
            name     : 'availablePackages',
            meta     : {title: 'Available Packages'}
        },
        {
            path     : '/package/order/view/:packageOrderId',
            component: PackageOrderDetails,
            name     : 'packageOrderDetails',
            meta     : {title: 'Package Order'}
        },
        {
            path     : '/package/view/:packageId/:packageKey?',
            component: PackageDetails,
            name     : 'packageDetails',
            meta     : {title: ''}
        },
        {
            path     : '/package',
            component: app.component('package-list-page'),
            name     : 'packageList',
            meta     : {title: 'Package list'}
        },
        {path: '/bookmark/pros', component: app.component('my-pros-page'), name: 'myPros', meta: {title: 'My Pros'}},
        {
            path     : '/search',
            component: app.component('search-pros-page'),
            name     : 'searchPro',
            meta     : {title: 'Search For a Pro'}
        },
        {
            path     : '/booking/available-slots/:userId',
            component: app.component('available-slots-page'),
            name     : 'availableSlots',
            meta     : {title: 'Available Slots', public: true}
        },
        {
            path     : '/video/available-slots/:userId',
            component: app.component('available-video-slots-page'),
            name     : 'availableVideoSlots',
            meta     : {title: 'Available Video Slots'}
        },
        {
            path     : '/video/confirm-slot/:videoSlotId',
            component: app.component('confirm-video-slot-page'),
            name     : 'confirmVideoSlot',
            meta     : {title: 'Confirm Video Slot', public: true}
        },
        {
            path     : '/:publicId/video/subscriptions',
            component: app.component('public-video-subscriptions-page'),
            name     : 'publicVideoSubscriptions',
            meta     : {title: 'Subscriptions For Sale'}
        },
        {path: '/:publicId/all-products', component: app.component('user-products-page'), name: 'userProducts'},
        {
            path     : '/booking/subscription/:subscriptionId',
            component: app.component('my-video-subscriptions-watch-page'),
            name     : 'myVideoSubscriptionsWatch',
            meta     : {title: 'My Video Subscriptions'}
        },
        {path: '/:publicId/products', component: PublicProductsPage, name: 'publicProducts'},
        {path: '/purchases', component: MyPurchasesPage, name: 'myPurchases', meta: {title: 'My Purchases'}},
        {path: '/event/create', component: app.component('create-event-page'), meta: {title: 'Create Event'}},
        {
            path     : '/event/edit/:eventId',
            component: app.component('create-event-page'),
            name     : 'eventEdit',
            meta     : {title: 'Edit Event'}
        },
        {
            path     : '/wizard',
            component: app.component('create-slot-page'),
            meta     : {title: 'Time Slot Wizard'},
            children : [
                {
                    path     : '/wizard/select-event',
                    component: app.component('select-event-page'),
                    meta     : {title: 'Time Slot Wizard'}
                },
                {
                    path     : '/wizard/custom-event',
                    component: app.component('custom-event-page'),
                    meta     : {title: 'Time Slot Wizard'}
                },
                {
                    path     : '/wizard/select-location',
                    component: app.component('select-location-page'),
                    meta     : {title: 'Time Slot Wizard'}
                },
                {
                    path     : '/wizard/select-dates',
                    component: app.component('select-dates-page'),
                    meta     : {title: 'Time Slot Wizard'}
                },
                {
                    path     : '/wizard/select-time',
                    component: app.component('select-time-page'),
                    meta     : {title: 'Time Slot Wizard'}
                },
                {
                    path     : '/wizard/select-ongoing-time',
                    component: WizardSelectOngoingTime,
                    meta     : {title: 'Time Slot Wizard'}
                },
                {
                    path     : '/wizard/images',
                    component: WizardUploadImages,
                    name     : 'wizardUploadImages',
                    meta     : {title: 'Time Slot Wizard'}
                },
                {
                    path     : '/wizard/select-promo-video',
                    component: app.component('slot-select-promo-video-page'),
                    meta     : {title: 'Time Slot Wizard'}
                },
                {
                    path     : '/wizard/confirm-slot',
                    component: app.component('confirm-slot-page'),
                    meta     : {title: 'Time Slot Wizard'}
                }
            ]
        },
        {path: '/video', component: app.component('video-page'), meta: {title: 'Video Library'}},
        {
            path     : '/video/slot/:videoSlotId',
            component: app.component('video-slot-details-page'),
            name     : 'videoSlotDetails',
            meta     : {title: 'Video Slot Details'}
        },
        {
            path     : '/video/slots',
            component: app.component('video-slots-page'),
            name     : "videoSlots",
            meta     : {title: 'Video Slots', roles: ['pro-starter', 'pro-plus', 'pro-business']}
        },
        {
            path     : '/video/booking/:bookingId/:highlightedMessageId?',
            component: app.component('video-booking-page'),
            name     : 'videoBooking',
            meta     : {title: 'Video Booking'}
        },
        {
            path     : '/video/events',
            component: app.component('event-list-page'),
            name     : 'videoEvents',
            meta     : {title: 'Video Events', isVideo: true}
        },
        {
            path     : '/video/event/create',
            component: app.component('create-event-page'),
            meta     : {title: 'Create Video Event', isVideo: true}
        },
        {
            path     : '/video/event/:videoEventId',
            component: app.component('create-event-page'),
            name     : 'videoEventEdit',
            meta     : {title: 'Edit Video Event', isVideo: true}
        },
        {
            path     : '/video/subscriptions',
            component: app.component('video-subscriptions-page'),
            name     : 'videoSubscriptions',
            meta     : {roles: ['pro-plus', 'pro-business'], title: 'Subscriptions'}
        },
        {
            path     : '/video/subscriptions/create',
            component: app.component('video-subscription-form-page'),
            name     : 'createVideoSubscription',
            meta     : {title: 'Create Video Subscription'}
        },
        {
            path     : '/video/subscriptions/:videoSubscriptionId/edit',
            component: app.component('video-subscription-form-page'),
            name     : 'editVideoSubscription',
            meta     : {title: 'Edit Video Subscription'}
        },
        {
            path     : '/video/subscriptions/:videoSubscriptionId',
            component: app.component('video-subscription-details-page'),
            name     : 'videoSubscriptionDetails',
            meta     : {title: 'Subscription Details'}
        },
        {
            path     : '/wizard/video',
            component: app.component('create-slot-page'),
            meta     : {title: 'Video Slot Wizard'},
            children : [
                {
                    path     : '/wizard/video/select-event',
                    component: app.component('select-event-page'),
                    meta     : {title: 'Video Slot Wizard', isVideo: true}
                },
                {
                    path     : '/wizard/video/custom-event',
                    component: app.component('video-custom-event-page'),
                    meta     : {title: 'Video Slot Wizard'}
                },
                {
                    path     : '/wizard/video/slot-options',
                    component: app.component('video-slot-options-page'),
                    meta     : {title: 'Video Slot Wizard'}
                },
                {
                    path     : '/wizard/video/select-promo-video',
                    component: app.component('slot-select-promo-video-page'),
                    meta     : {title: 'Video Slot Wizard', videoSlot: true}
                },
                {
                    path     : '/wizard/video/confirm-slot',
                    component: app.component('video-confirm-slot-page'),
                    meta     : {title: 'Video Slot Wizard'}
                },
            ]
        },
        {path: '/videos-customer', component: app.component('videos-customer-page'), name: 'videosCustomer'},
        {
            path     : '/products',
            component: ProductsPage,
            name     : 'products',
            meta     : {title: 'My Products', roles: ['pro-plus', 'pro-business']}
        },
        {path: '/product/types', component: app.component('product-types-page'), name: 'productTypes'},
        {
            path     : '/product/types/create',
            component: app.component('create-product-type-page'),
            name     : 'createProductType',
            meta     : {title: 'Add a product'}
        },
        {
            path     : '/product/types/:productTypeId/edit',
            component: app.component('create-product-type-page'),
            name     : 'editProductType',
            meta     : {title: 'Update a product'}
        },
        {path: '/product/:productId', component: ProductDetailsPage, name: 'productDetails'},
        {path: '/product/:bookingId/chat', component: ProductChatPage, name: 'productChat'},
        {
            path     : '/wizard/product',
            component: app.component('create-slot-page'),
            meta     : {title: 'Product Wizard'},
            children : [
                {
                    path     : '/wizard/product/select-type',
                    component: app.component('select-event-page'),
                    name     : 'wizardProductType',
                    meta     : {title: 'Product Wizard', isProduct: true}
                },
                {
                    path     : '/wizard/product/inventory',
                    component: ProductOptions,
                    name     : 'wizardProductOptions',
                    meta     : {title: 'Product Wizard'}
                },
                {
                    path     : '/wizard/product/images',
                    component: WizardSelectImage,
                    name     : 'wizardProductImages',
                    meta     : {title: 'Product Wizard', isProduct: true}
                },
                {
                    path     : '/wizard/product/select-promo-video',
                    component: app.component('slot-select-promo-video-page'),
                    meta     : {title: 'Product Wizard', isProduct: true}
                },
                {
                    path     : '/wizard/product/confirm-product',
                    component: WizardConfirmProduct,
                    meta     : {title: 'Product Wizard'}
                },
            ]
        },
        {path: '/my-managers', component: MyManagers, name: 'myManagers'},
        {path: '/manage-dashboard', component: ManageDashboard, name: 'manageDashboard'},
        {path: '/manage', component: ManagePros, name: 'managePros'},
        {path: '/invite-list', component: InviteList, name: 'inviteList', meta: {title: 'Invite List'}},
        {path: '/autobook', component: AutoBook, name: 'autoBook', meta: {title: 'AutoBook'}},
        {path: '/my-autobooks', component: MyAutoBooks, name: 'myAutoBooks', meta: {title: 'My AutoBooks'}},
        {path: '/embed-code', component: EmbedCode, name: 'embedCode', meta: {title: 'EmbedCode'}},
        {path: '/request', component: Request, name: 'request', meta: {title: 'Slot Request'}},
        {path: '/custom-email', component: CustomEmail, name: 'customEmail', meta: {title: 'Custom Email'}},
        {path: '/location-list', component: LocationList, name: 'locationList', meta: {title: 'Location List'}},
        {path: '/location/add', component: EditLocation, name: 'addLocation', meta: {title: 'Add Location'}},
        {
            path     : '/location/edit/:locationId',
            component: EditLocation,
            name     : 'editLocation',
            meta     : {title: 'Edit Location'}
        },
        {path: '/subscription', component: Subscription, name: 'subscription', meta: {title: 'Subscription'}},
        {path: '/plan', component: ChoosePlan, name: 'choosePlan', meta: {title: 'Choose Plan'}},
        {path: '/pro-faq', component: ProFaq, name: 'proFaq', meta: {title: 'Pro Faq'}},
        {path: '/customer-faq', component: CustomerFaq, name: 'customerFaq', meta: {title: 'Customer Faq'}},
        {path: '/tutorial-videos', component: TutorialVideos, name: 'tutorialVideos', meta: {title: 'Tutorial Videos'}},
        {path: '/referrals', component: Referrals, name: 'referrals', meta: {title: 'Referrals'}},
        {path: '/calendar-sync', component: CalendarSync, name: 'calendarSync', meta: {title: 'Calendar Sync'}},
        {path: '/:pathMatch(.*)*', name: 'pageNotFound', component: PageNotFound}
    ]
}

export default routes
