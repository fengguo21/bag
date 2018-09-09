<template>	
	<el-table :data="vipLevel" border style="width: 100%">
	    <el-table-column label="会员等级"  prop='level' sortable>
	    </el-table-column>
	    <el-table-column label="商品单价"  prop='price' sortable>
	    </el-table-column>
	    <el-table-column label="商品数量"  prop='count' sortable>
	    </el-table-column>
	    <el-table-column label="操作">
	      <template scope="scope" width='100'>
	        <el-button
	          size="small"
	          type="danger"
	          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
	      </template>
	    </el-table-column>
  	</el-table>
</template>
<script>
	export default {
		name: 'showLevel',
		data() {
			return {
				vipLevel: this.$store.getters.getNewLevel,
			}	
		},
		methods: {
			handleDelete(index, row) {
				// console.log(index, row)
				this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          this.$message({
		            type: 'success',
		            message: '删除成功!'
		          });
		          this.$store.dispatch('delLevel', row);
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
			}
		}
	}
</script>
<style scoped>
	
</style>