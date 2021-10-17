import BookAsGuest from './components/Auth/BookAsGuest.vue'
import LoadingButton from './components/Controls/LoadingButton.vue'
import Errors from './components/Controls/Errors.vue'
import DurationPicker from './components/Controls/DurationPicker.vue'
import PaymentStatusManage from './components/Controls/PaymentStatusManage.vue'
import DatePicker from './components/Controls/DatePicker.vue'
import TimePicker from './components/Controls/TimePicker.vue'
import LoadingOverlay from './components/Controls/LoadingOverlay.vue'
import Autocomplete from './components/Controls/Autocomplete.vue'
import BookInviteButtons from './components/Controls/BookInviteButtons.vue'
import PayButtons from './components/Controls/PayButtons.vue'
import StripePlanButton from './components/Controls/StripePlanButton.vue'
import StripeButton from './components/Controls/StripeButton.vue'
import VueUploadComponent from 'vue-upload-component'
import TagEditor from './components/Controls/TagEditor.vue'
import Pages from './components/Controls/Pages.vue'
import TodaysIncome from './components/Dashboard/TodaysIncome.vue'
import TodaysSlots from './components/Dashboard/TodaysSlots.vue'
import MonthlyRevenue from './components/Dashboard/MonthlyRevenue.vue'
import Confirm from './components/Confirm.vue'
import Modal from './components/Modal.vue'
import ModalsHolder from './components/ModalsHolder.vue'
import MyManagers from './components/MyManagers.vue'
import ManagePros from './components/ManagePros.vue'
import ManageDashboard from './components/ManageDashboard.vue'
import TsPackageList from './components/TsPackageList.vue'
import TsPackage from './components/TsPackage.vue'
import TsPackageDetails from './components/TsPackageDetails.vue'
import PackageOrders from './components/PackageOrders.vue'
import PackageOrder from './components/PackageOrder.vue'
import PackageOrdersPro from './components/PackageOrdersPro.vue'
import PackageOrderPro from './components/PackageOrderPro.vue'
import PackageItem from './components/Packages/PackageItem.vue'
import PackageList from './components/Packages/PackageList.vue'
import Search from './components/Search.vue'
import Slots from './components/Slots.vue'
import EventForm from './components/Event/EventForm.vue'
import InviteCustomerSelect from './components/InviteList/InviteCustomerSelect.vue'
import InviteListCard from './components/InviteList/InviteListCard.vue'
import InviteListTable from './components/InviteList/InviteListTable.vue'
import CustomerToInviteList from './components/InviteList/CustomerToInviteList.vue'
import ProAutoBookItem from './components/AutoBook/ProAutoBookItem.vue'
import ProAutoBookList from './components/AutoBook/ProAutoBookList.vue'
import AutoBookItem from './components/AutoBook/AutoBookItem.vue'
import AutoBookList from './components/AutoBook/AutoBookList.vue'
import AutoBookForm from './components/AutoBook/AutoBookForm.vue'
import BookingItem from './components/Bookings/BookingItem.vue'
import BookingList from './components/Bookings/BookingList.vue'
import SlotFilter from './components/SlotFilter.vue'
import SlotItem from './components/Slots/SlotItem.vue'
import VideoSlotItem from './components/Slots/VideoSlotItem.vue'
import SlotList from './components/Slots/SlotList.vue'
import BookForCustomer from './components/Slots/BookForCustomer.vue'
import InviteCustomer from './components/Slots/InviteCustomer.vue'
import SlotRequest from './components/Pro/SlotRequest.vue'
import CustomerBookingItem from './components/Bookings/CustomerBookingItem.vue'
import CustomerBookingList from './components/Bookings/CustomerBookingList.vue'
import CustomerItem from './components/Pro/CustomerItem.vue'
import CustomerList from './components/Pro/CustomerList.vue'
import CustomerDetailCard from './components/Pro/CustomerDetailCard.vue'
import UserList from './components/Admin/UserList.vue'
import UserListItem from './components/Admin/UserListItem.vue'
import AddUserForm from './components/Admin/AddUserForm.vue'
import DeleteUserForm from './components/Admin/DeleteUserForm.vue'
import ChooseUsers from './components/ChooseUsers.vue'
import HourSelect from './components/HourSelect.vue'
import MinuteSelect from './components/MinuteSelect.vue'
import ProfileCard from './components/ProfileCard.vue'
import VideoSlotDetails from './components/VideoSlotDetails.vue'
import Player from './components/Player.vue'
import VideoThumb from './components/VideoThumb.vue'
import VideoList from './components/VideoList.vue'
import VideoEdit from './components/VideoEdit.vue'
import VideoUpload from './components/VideoUpload.vue'
import UploadBar from './components/UploadBar.vue'
import VideoChooseOrUpload from './components/VideoChooseOrUpload.vue'
import VideoSubscriptionForm from './components/VideoSubscriptionForm.vue'
import MyVideoBookingItem from './components/Bookings/MyVideoBookingItem.vue'
import VideoQuota from './components/VideoQuota.vue'
import VueMultiselect from 'vue-multiselect'
import Message from './components/Chat/Message.vue'
import Notifications from './components/Notifications.vue'
import BookedSubscription from './components/Subscriptions/BookedSubscription.vue'
import CustomerBookedSubscription from './components/Subscriptions/CustomerBookedSubscription.vue'
import ModalVideoChooseOrUpload from './components/Modals/VideoChooseOrUpload.vue'
import Dashboard from './pages/Dashboard.vue'
import SlotListPage from './pages/SlotList.vue'
import EventList from './pages/EventList.vue'
import Packages from './pages/Packages.vue'
import PrivateCalendar from './pages/PrivateCalendar.vue'
import PaymentHistory from './pages/PaymentHistory.vue'
import MyBookings from './pages/MyBookings.vue'
import MyVideoBookings from './pages/MyVideoBookings.vue'
import MyVideoSubscriptions from './pages/MyVideoSubscriptions.vue'
import MyVideoSubscriptionsWatch from './pages/MyVideoSubscriptionsWatch.vue'
import MyPackages from './pages/MyPackages.vue'
import PackageListPage from './pages/PackageList.vue'
import MyPros from './pages/MyPros.vue'
import SearchPros from './pages/SearchPros.vue'
import AvailableSlots from './pages/AvailableSlots.vue'
import AvailableVideoSlots from './pages/AvailableVideoSlots.vue'
import ConfirmVideoSlot from './pages/ConfirmVideoSlot.vue'
import CreateEvent from './pages/CreateEvent.vue'
import CreateSlot from './pages/CreateSlot.vue'
import SelectEvent from './pages/SlotWizard/SelectEvent.vue'
import CustomEvent from './pages/SlotWizard/CustomEvent.vue'
import SelectLocation from './pages/SlotWizard/SelectLocation.vue'
import SelectDates from './pages/SlotWizard/SelectDates.vue'
import SelectTime from './pages/SlotWizard/SelectTime.vue'
import SelectPromoVideo from './pages/SlotWizard/SelectPromoVideo.vue'
import ConfirmSlot from './pages/SlotWizard/ConfirmSlot.vue'
import Video from './pages/Video.vue'
import VideoBrowser from './components/VideoBrowser.vue'
import VideoSlots from './pages/VideoSlots.vue'
import VideoSlotDetailsPage from './pages/VideoSlotDetails.vue'
import VideoBooking from './pages/VideoBooking.vue'
import VideoSubscriptions from './pages/VideoSubscriptions.vue'
import VideoSubscriptionFormPage from './pages/VideoSubscriptionForm.vue'
import VideoSubscriptionDetails from './pages/VideoSubscriptionDetails.vue'
import PublicVideoSubscriptions from './pages/PublicVideoSubscriptions.vue'
import VideoCustomEvent from './pages/VideoSlotWizard/CustomEvent.vue'
import SlotOptions from './pages/VideoSlotWizard/SlotOptions.vue'
import VideoConfirmSlot from './pages/VideoSlotWizard/ConfirmSlot.vue'
import UserProducts from './pages/UserProducts.vue'
import VideosCustomer from './pages/VideosCustomer.vue'
import ProductTypes from './pages/ProductTypes.vue'
import CreateProductType from './pages/CreateProductType.vue'
import ImageUpload from './components/ImageUpload.vue'

export function register(app) {
    app.component('book-as-guest', BookAsGuest)
    app.component('loading-button', LoadingButton)
    app.component('errors', Errors)
    app.component('duration-picker', DurationPicker)
    app.component('payment-status-manage', PaymentStatusManage)
    app.component('date-picker', DatePicker)
    app.component('time-picker', TimePicker)
    app.component('loading-overlay', LoadingOverlay)
    app.component('autocomplete', Autocomplete)
    app.component('book-invite-buttons', BookInviteButtons)
    app.component('pay-buttons', PayButtons)
    app.component('stripe-plan-button', StripePlanButton)
    app.component('stripe-button', StripeButton)
    app.component('file-upload', VueUploadComponent)
    app.component('tag-editor', TagEditor)
    app.component('pages', Pages)
    app.component('todays-income', TodaysIncome)
    app.component('todays-slots', TodaysSlots)
    app.component('monthly-revenue', MonthlyRevenue)
    app.component('confirm', Confirm)
    app.component('modal', Modal)
    app.component('modals-holder', ModalsHolder)
    app.component('my-managers', MyManagers)
    app.component('manage-pros', ManagePros)
    app.component('manage-dashboard', ManageDashboard)
    app.component('ts-package-list', TsPackageList)
    app.component('ts-package', TsPackage)
    app.component('ts-package-details', TsPackageDetails)
    app.component('package-orders', PackageOrders)
    app.component('package-order', PackageOrder)
    app.component('package-orders-pro', PackageOrdersPro)
    app.component('package-order-pro', PackageOrderPro)
    app.component('package-item', PackageItem)
    app.component('package-list', PackageList)
    app.component('search', Search)
    app.component('slots', Slots)
    app.component('event-form', EventForm)
    app.component('invite-customer-select', InviteCustomerSelect)
    app.component('invite-list-card', InviteListCard)
    app.component('invite-list-table', InviteListTable)
    app.component('customer-to-invite', CustomerToInviteList)
    app.component('pro-autobook-item', ProAutoBookItem)
    app.component('pro-autobook-list', ProAutoBookList)
    app.component('autobook-item', AutoBookItem)
    app.component('autobook-list', AutoBookList)
    app.component('autobook-form', AutoBookForm)
    app.component('booking-item', BookingItem)
    app.component('booking-list', BookingList)
    app.component('slot-filter', SlotFilter)
    app.component('slot-item', SlotItem)
    app.component('video-slot-item', VideoSlotItem)
    app.component('slot-list', SlotList)
    app.component('book-for-customer', BookForCustomer)
    app.component('invite-customer', InviteCustomer)
    app.component('slot-request', SlotRequest)
    app.component('customer-booking-item', CustomerBookingItem)
    app.component('customer-booking-list', CustomerBookingList)
    app.component('pro-customer-item', CustomerItem)
    app.component('pro-customer-list', CustomerList)
    app.component('pro-customer-card', CustomerDetailCard)
    app.component('admin-user-list', UserList)
    app.component('admin-user-list-item', UserListItem)
    app.component('admin-add-user-form', AddUserForm)
    app.component('admin-delete-user-form', DeleteUserForm)
    app.component('choose-users', ChooseUsers)
    app.component('hour-select', HourSelect)
    app.component('minute-select', MinuteSelect)
    app.component('profile-card', ProfileCard)
    app.component('video-slot-details', VideoSlotDetails)
    app.component('player', Player)
    app.component('video-thumb', VideoThumb)
    app.component('video-list', VideoList)
    app.component('video-edit', VideoEdit)
    app.component('video-upload', VideoUpload)
    app.component('upload-bar', UploadBar)
    app.component('video-choose-upload', VideoChooseOrUpload)
    app.component('video-subscription-form', VideoSubscriptionForm)
    app.component('my-video-booking-item', MyVideoBookingItem)
    app.component('video-quota', VideoQuota)
    app.component('multiselect', VueMultiselect)
    app.component('chat-message', Message)
    app.component('notifications', Notifications)
    app.component('booked-video-subscription', BookedSubscription)
    app.component('customer-booked-video-subscription', CustomerBookedSubscription)
    app.component('modal-video-choose-or-upload', ModalVideoChooseOrUpload)
    app.component('dashboard-page', Dashboard)
    app.component('slot-list-page', SlotListPage)
    app.component('event-list-page', EventList)
    app.component('packages-page', Packages)
    app.component('private-calendar-page', PrivateCalendar)
    app.component('payment-history-page', PaymentHistory)
    app.component('my-bookings-page', MyBookings)
    app.component('my-video-bookings-page', MyVideoBookings)
    app.component('my-video-subscriptions-page', MyVideoSubscriptions)
    app.component('my-video-subscriptions-watch-page', MyVideoSubscriptionsWatch)
    app.component('my-packages-page', MyPackages)
    app.component('package-list-page', PackageListPage)
    app.component('my-pros-page', MyPros)
    app.component('search-pros-page', SearchPros)
    app.component('available-slots-page', AvailableSlots)
    app.component('available-video-slots-page', AvailableVideoSlots)
    app.component('confirm-video-slot-page', ConfirmVideoSlot)
    app.component('create-event-page', CreateEvent)
    app.component('create-slot-page', CreateSlot)
    app.component('select-event-page', SelectEvent)
    app.component('custom-event-page', CustomEvent)
    app.component('select-location-page', SelectLocation)
    app.component('select-dates-page', SelectDates)
    app.component('select-time-page', SelectTime)
    app.component('slot-select-promo-video-page', SelectPromoVideo)
    app.component('confirm-slot-page', ConfirmSlot)
    app.component('video-page', Video)
    app.component('video-browser', VideoBrowser)
    app.component('video-slots-page', VideoSlots)
    app.component('video-slot-details-page', VideoSlotDetailsPage)
    app.component('video-booking-page', VideoBooking)
    app.component('video-subscriptions-page', VideoSubscriptions)
    app.component('video-subscription-form-page', VideoSubscriptionFormPage)
    app.component('video-subscription-details-page', VideoSubscriptionDetails)
    app.component('public-video-subscriptions-page', PublicVideoSubscriptions)
    app.component('video-custom-event-page', VideoCustomEvent)
    app.component('video-slot-options-page', SlotOptions)
    app.component('video-confirm-slot-page', VideoConfirmSlot)
    app.component('user-products-page', UserProducts)
    app.component('videos-customer-page', VideosCustomer)
    app.component('product-types-page', ProductTypes)
    app.component('create-product-type-page', CreateProductType)
    app.component('image-upload', ImageUpload)
}
