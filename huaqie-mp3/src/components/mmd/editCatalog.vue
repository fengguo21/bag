<template>
	<div class='edit-wrap'>
		<el-button @click.native="$router.go(-1)" style='margin-bottom: 20px;'>取消修改</el-button>
		<el-form :model="editCatalogForm" label-width="80px" ref="editCatalogForm">
			<el-form-item label="名称" prop="title">
				<el-input class='small-el-input' v-model="editCatalogForm.title" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="排序">
				<el-input-number v-model="editCatalogForm.order" :min="0" :max="200"></el-input-number>
			</el-form-item>
			<el-form-item label="头像">
				<el-upload
			  class="avatar-uploader"
			  action="https://g2.huaqie.com/cloud/app/upload"
			  :show-file-list="false"
			  :on-success="handleAvatarSuccess"
			  :before-upload="beforeAvatarUpload">
			  <img v-if="imageUrl" :src="imageUrl" class="avatar-2">
			  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
			</el-form-item>
			<el-table
		      :data="editCatalogForm.children"
		      style="width: 80%">
		      <el-table-column
		        prop="avatar"
		        label="头像"
		        width="200">
		        <template scope='scope'>
		        	<img :src="scope.row.avatar" width='60' height='60' style='padding-top:5px'>
		        </template>
		      </el-table-column>
		      <el-table-column
		        prop="title"
		        label="名称">
		      </el-table-column>
		      <el-table-column
		        prop="order"
		        label="排序"
		        width="180">
		      </el-table-column>
		      <el-table-column label="操作" width="150">
	            <template scope="scope">
	              <el-button
	                size="small"
	                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
	              <el-button
	                size="small"
	                type="danger"
	                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
	            </template>
	          </el-table-column>
		    </el-table>
		</el-form>
		<div class="edit-footer">
			<el-button @click.native="$router.go(-1)">取消修改</el-button>
			<el-button type="primary" @click.native="editCatalogSubmit">提交</el-button>
		</div>


		<el-dialog title="修改子分类" v-model="editCatalogChildVisible" :close-on-click-modal="false">
			<el-form :model="editCatalogChildForm" label-width="80px" :rules="editCatalogChildFormRules" ref="addCatalogForm">
				<el-form-item label="名称" prop="title">
					<el-input v-model="editCatalogChildForm.title" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="editCatalogChildForm.order" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="头像">
					<el-upload
				  class="avatar-uploader"
				  action="https://g2.huaqie.com/cloud/app/upload"
				  :show-file-list="false"
				  :on-success="handleChildAvatarSuccess"
				  :before-upload="beforeAvatarUpload">
				  <img v-if="imageChildUrl" :src="imageChildUrl" class="avatar">
				  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editCatalogChildVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editCatalogChildSubmit" >提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import { updateCatalog } from '@/api/api';
export default {
	data() {
		return {
			editCatalogForm: {
				catalogId: '',
				title: '',
				order: 0,
				avatar: '',
				children: []
			},
			imageUrl: '',
			imageChildUrl: '',
			editCatalogChildVisible: false,
			editCatalogChildForm: {
				catalogId: '',
				title: '',
				order: 0,
				avatar: ''
			},
			editCatalogChildFormRules: {
				title: [
					{ required: true, message: '请输入子分类名称', trigger: 'blur' }
				],
			}
		}
	},
	methods: {
		getMsg() {
			let edit = this.store.get('editCatalog');
			// console.log(edit.catalogId);
			this.editCatalogForm = {
				catalogId: edit.catalogId,
				title: edit.basic.title,
				order: edit.basic.order,
				avatar: edit.basic.avatar,
				children: edit.basic.children
			}
			this.imageUrl = edit.basic.avatar
		},
	  handleAvatarSuccess(res, file) {
		if(res.code){
			this.$message.error({
				message: res.message
			})
			return
		}
		this.imageUrl = res.data.url
		// console.log(this.imageUrl)
		//this.imageUrl = URL.createObjectURL(file.raw);
      },
      handleChildAvatarSuccess(res, file) {
		if(res.code){
			this.$message.error({
				message: res.message
			})
			return
		}
		this.imageChildUrl = res.data.url
		console.log(this.imageChildUrl)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isPNG) {
          this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return (isJPG || isPNG) && isLt2M;
      },
      handleEdit(index, row) {
      	this.editCatalogChildVisible = true;
      	this.imageChildUrl = row.avatar;
      	this.editCatalogChildForm = {
      		catalogId: row.catalogId,
			title: row.title,
			order: row.order,
			avatar: row.avatar
		};
      },
      handleDelete(index, row) {
      	// console.log(this.editCatalogForm.children);
		this.editCatalogForm.children.forEach((item, index) => {
			if(item.catalogId&&item.catalogId === row.catalogId) {
				this.editCatalogForm.children.splice(index, 1);
			}
			// console.log(index, item);
		})
      },
      editCatalogChildSubmit() {
      	let editCatalog = Object.assign({}, this.store.get('editCatalog'));
      	this.editCatalogChildForm.avatar = this.imageChildUrl;
      	// console.log(this.editCatalogChildForm);
      	editCatalog.basic.title =  this.editCatalogForm.title;
      	editCatalog.basic.order =  this.editCatalogForm.order;
      	editCatalog.basic.avatar = this.editCatalogForm.avatar;
      	editCatalog.basic.children.forEach(item => {
      		// console.log(item.catalogId=== this.editCatalogChildForm.catalogId);
      		if(item.catalogId&&item.catalogId === this.editCatalogChildForm.catalogId) {
      			// console.log(item.catalogId +"======"+ this.editCatalogChildForm.catalogId)
      			item.avatar = this.editCatalogChildForm.avatar;
      			item.catalogId = this.editCatalogChildForm.catalogId;
      			item.order = this.editCatalogChildForm.order;
      			item.title = this.editCatalogChildForm.title
      			return;
      		}
      	})
      	this.store.set('editCatalog', editCatalog);
      	this.getMsg();
      	// console.log(this.store.get('editCatalog'));
      	this.editCatalogChildVisible = false;
      },
      editCatalogSubmit() {
      	this.editCatalogForm.avatar = this.imageUrl;
      	updateCatalog(this.editCatalogForm).then(res => {
      		if(res.code > 0) {
      			this.$message.error({
      				message: res.message
      			})
      		}
      		this.$message.success({
  				message: '修改成功'
  			})
  			this.$router.go(-1);
      	})
      	// console.log(this.editCatalogForm);
      	// updateCatalog 
      },
	},
	mounted() {
		this.getMsg()
	}
}
</script>
<style scoped>
.edit-wrap {
	width: 90%;
	padding-top: 20px;
	margin: 0 auto;
}
.edit-footer {
	margin-top: 20px;
}
.avatar-uploader .el-upload {
   border: 1px dashed #d9d9d9;
   border-radius: 6px;
   cursor: pointer;
   position: relative;
   overflow: hidden;
 }
 .avatar-uploader .el-upload:hover {
   border-color: #20a0ff;
 }
 .avatar-uploader-icon {
   font-size: 28px;
   color: #8c939d;
   width: 178px;
   height: 178px;
   line-height: 178px;
   text-align: center;
 }
 .avatar {
   width: 178px;
   height: 178px;
   display: block;
 }
 .avatar-2 {
 	width: 200px;
   height: 100px;
   display: block;
 }
</style>