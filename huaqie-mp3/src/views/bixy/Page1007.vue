<template>
	<div class='news'>
		<div v-if='isChange'>
			<vue-html5-editor :content="content" :height="500" :z-index="1000" :auto-height="false" :show-module-name="false" @change="updateData"></vue-html5-editor>
			<div class='news-btn'>
				<el-button style='float: right' type="primary" @click='save'>Confirm Save</el-button>
				<el-button v-if='contentDB != ""' style='float: right; margin-right: 10px' @click='isChange = false'>Cancel Edit</el-button>
			</div>
		</div>
		<div v-else>
			<div v-html='contentDB'></div>
			<div class='news-btn'>
				<el-button style='float: right' type="primary" @click='edit'>Edit</el-button>
			</div>
		</div>
		
	</div>
</template>
<script>
import { setupFaq, getFaq } from '@/api/api' 
export default {
	name: 'problem',
	data() {
		return {
			content: '',
			contentDB: '',
			isChange: false
		}
	},
	created() {
		this.getFaq();
	},
	methods: {
		updateData(val) {
			this.content = val;
			// console.log(val);
		},
		getFaq() {
			getFaq({}).then(res => {
				if(res.code > 0) {
					this.$message.error(res.message)
					return;
				}
				this.contentDB = res.data?res.data.basic.text:"";
				this.isChange = res.data? false:true
			})
		},
		save() {
			if(this.content == '') {
				this.$message.error('The content can not be blank');
				return;
			}
			this.contentDB = '';
			setupFaq({
				text: this.content
			}).then(res => {
				if(res.code > 0) {
					this.$message.error(res.message)
					return;
				}
				this.$message.success('Saved successfully')
				this.getFaq()
				this.isChange = false;
			})
			// console.log(this.content);
		},
		edit() {
			this.isChange = true;
			this.content = this.contentDB;
		}
	}
}
</script>
<style scoped>
.news {
	margin-top: 40px;
}
.news-btn {
	margin-top: 20px;
	overflow: hidden;
}
</style>