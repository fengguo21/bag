<template>
	<el-dialog title="新增分类" v-model="$store.getters.getLevelStatus" :close-on-click-modal="false" :show-close='false'>
		<el-form :model="addForm" :rules='rules' label-width="120px" ref="addForm">
			<el-form-item label="会员等级" prop="level">
				<el-input v-model="addForm.level" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="商品单价" prop="price">
				<el-input v-model="addForm.price" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="商品数量" prop="count">
				<el-input v-model="addForm.count" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="changeLevel">取消</el-button>
			<el-button type="primary" @click.native="addLevel">确定</el-button>
		</div>
	</el-dialog>
</template>
<script>
	export default {
		name: 'addLevelDialog',
		data () {
			return {
				dialogStatu: this.$store.getters.getLevelStatus,
				addForm: {
					level: '',
					price: '',
					count: ''
				},
				rules: {
		          level: [
		            { required: true, message: '请输入会员等级', trigger: 'blur' },
		          ],
		          price: [
		          	{ required: true, message: '请输入商品单价', trigger: 'blur' },
		          ],
		          count: [
		          	{ required: true, message: '请输入商品数量', trigger: 'blur' },
		          ]
		        }
			}
		},
		methods: {
			changeLevel() {
				this.$store.dispatch('changeLevel', false);
				this.addForm = {
					level: '',
					price: '',
					count: ''
				}
			},
			addLevel() {
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						this.$store.dispatch('addLevel', this.addForm);
						this.changeLevel();
					} else {
						this.$message({
							type: 'error',
							message: '添加失败，数据不能为空'
						})
					}
				})
			}
		}
	}
</script>
<style scoped>

</style>
