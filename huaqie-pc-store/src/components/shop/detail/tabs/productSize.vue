<template>
<div id="tab_content_2" class="tab_content" style='display: block'>
	<table cellpadding="0" cellspacing="0" width="100%" border="0">
		<tbody>
		<!-- 每一个tr是一种参数 -->
		<tr v-for='(item, key) in prosize'>
		<!-- 参数名称 -->
			<td valign="top" class="thuoctinh_cat" nowrap="nowrap" style="border-bottom:1px solid #CCCCCC; padding-left:30px; width:250px">
				<font><font>{{key|filterKey}}</font></font>
			</td>
		<!-- 子参数 -->
			<td style="border-bottom:1px solid #CCCCCC;border-top:1px solid #fff;">
			<!-- 嵌套表格 展示子参数 -->
			<table cellpadding="0" cellspacing="0" width="100%" style="border:0px solid #D9D9D9; border-bottom:none;">
				<tbody>
				<!-- 每一个新的tr是一个新的子元素 -->
					<tr>
					<!-- 子参数名 -->
						<td style="  border-bottom:1px dotted #D9D9D9; padding:10px; text-align:right;font-size:12px; font-family:Arial, Helvetica, sans-serif; color:#000000;" valign="top" width="150">
							<font><font>{{item[0]}}</font></font>
						</td>
					<!-- 子参数值 -->
						<td style="   border-bottom:1px dotted #D9D9D9; border-left:1px solid #ccc; padding:10px;font-size:12px; font-family:Arial; text-align:left;">
							<font><font>{{item[1]}}</font></font><br>
						</td>
					</tr>
				</tbody>
			</table>
			</td>
		</tr>

		</tbody>
	</table>
</div>
</template>
<script>
export default {
	name: 'productSize',
	filters: {
		filterKey(val) {
			return '规格参数'+(val+1)
		}
	},
	props: {
		prosize: Array
	}
}
</script>
<style scoped>
.thuoctinh_cat {
    color: #000;
    font-size: 12px;
    font-weight: 600;
    padding: 10px 0 10px 0;
    background: #F6F6F6;
}
</style>