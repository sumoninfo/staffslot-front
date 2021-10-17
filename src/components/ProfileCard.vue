<template>
	<div class="card">
		<img class="col-10 mx-auto" :src="profilePhotoLink">
		<div class="card-body">
			<h5 class="card-title" v-text="user.account.full_name"></h5>
			<p class="card-text">{{ __('Email') }}: <span v-text="user.email"></span></p>
			<p class="card-text">{{ __('Phone') }}: <a :href="'tel:'+ user.account.contact_number" v-text="user.account.contact_number"></a></p>
			<p class="card-text">{{ __('City') }}: <span v-text="user.account.city"></span></p>
		</div>
	</div>
</template>
<script>
import helpers from '../mixins/helpers';
	export default {
		mixins: [helpers],
		props:['user'],
		computed:{
			profilePhotoLink: function(){
				const port = window.location.port == '80' ? '' : ':' + window.location.port

				if (this.user.account.profile_photo!="" && this.user.account.profile_photo!=null) {
					return "//"+window.location.hostname + port + "/storage/uploads/"+ this.user.account.profile_photo;
				} else {
					return "//"+window.location.hostname + port + "/images/default-profile-time-slot-pro.png";
				}
			},
		}
	};
</script>
