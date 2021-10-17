<template>
	<select :name="name" @change="change" class="form-control" v-model="minute">
		<option v-for="(item,index) in items" :value="item.value">{{item.text}}</option>
	</select>
</template>

<script>
		import helpers from '../mixins/helpers'

    export default {
			mixins: [helpers],
    	props:{
            name,
    		start:{
    			default: 0,
    		},
    		end:{
    			default:59,
    		},
            defaultval:{
                default:0,
            }
    	},
    	data:function(){
    		return {
    			minute:null
    		};
    	},
    	computed:{
    		items: function items(){
    			var list = new Array();
                var count=0;
    			for (var i = this.start; i <= this.end; i++) {
    				list[count++] = {value:i, text:('0'+i).slice(-2)};
    			}
    			return list;
    		}
		},
		methods: {
			change (e) {
				this.$emit('input', e.target.value);
			}
		},
        mounted() {
            this.minute = this.defaultval; 
        },
    };
</script>
