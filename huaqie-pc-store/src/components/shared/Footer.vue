<template>
	<div class="footer">
		<div id="menus_bottom" align="center">
			<router-link to='/'>
				<font>
					<font>Trang chủ</font>
				</font>
			</router-link>
			<font>
				<font> | </font>
			</font>
			<router-link to='/shared/briefInfo'>
				<font>
					<font>Giới thiệu ngắn gọn về Công ty</font>
				</font>
			</router-link>
			<font>
				<font> | </font>
			</font>
			<router-link to='/advantage/product'>
				<font>
					<font>CHÍNH SÁCH BẢO HÀNH</font>
				</font>
			</router-link>
			<font>
				<font> | </font>
			</font>
			<router-link to='/advantage/service'>
				<font>
					<font>Chính sách Riêng tư</font>
				</font>
			</router-link>
			<font>
				<font> | </font>
			</font>
			<router-link to='/advantage/news'>
				<font>
					<font>Tin tức</font>
				</font>
			</router-link>
			<font>
				<font> | </font>
			</font>
			<router-link to='/advantage/guide'>
				<font>
					<font>Liên lạc</font>
				</font>
			</router-link>
			<font>
				<font> | </font>
			</font>
			<router-link to='/advantage/FAQ'>
				<font>
					<font>Câu hỏi thường gặp</font>
				</font>
			</router-link>
		</div>
		<div>
			<!--<div style="background:url(http://suntekvietnam.vn/images/icon_mail.png) no-repeat left center; margin:10px 0 10px 0; text-align:left; padding:12px 0 12px 40px; color:#E3E3E3; text-transform:uppercase;">
				<font>
					<font>联系信息</font>
				</font><img align="right" style="padding: 0px 130px 10px 0px;" src="../../assets/images/support.png"></div>-->

			<div class="clear"></div>
			<div style="float:left; width:980px; padding-bottom:7px;">
				<table cellspacing="1" cellpadding="3" width="100%" border="0">
					<tbody>
						<tr>
							
							<td><span style="color:#FFFFFF;"><span style="font-size:small;"><b><font><font>Trung  Tâm  Bảo  Hành</font></font></b></span></span>
							</td>
						</tr>
						<tr>
							
							<td><span style="color:#FFFFFF;"><span style="font-size:small;"><b><font><font>P217, Tầng 2, F3 TT Cao Su Sao Vàng, Ngõ 41 Khương Đình, Thanh Xuân, Hà Nội</font></font></b></span></span>
								<font><span style="font-size:small;"><span style="color: rgb(0, 102, 204);"></span></span>
								</font><span style="font-size:small;"> <span style="color: rgb(0, 102, 204);"><font></font></span></span>
							</td>
						</tr>
						<tr>
							
							<td><span style="color:#FFFFFF;"><span style="font-size:small;"><b><font><font>Tel： 0912997588 </font></font></b><font></font><br>
     </span></span>
							</td>
						</tr>
						<tr>
							
							<td><span style="color:#FFFFFF;"><span style="font-size:small;"><b><font><font>TP。</font><font>Open: Sáng: 8h - 12h - Chiều: 1h30 - 5h30</font></font></b></span></span><span style="font-size:small;"><span style="color: rgb(0, 102, 204);"></span></span>
							</td>
						</tr>
						
					</tbody>
				</table>
				<p>&nbsp;</p>
			</div>
			<div class="clear"></div>
			
			
			<div class="clear"></div>
			<div id="footer_right" style="float:right">
				<p align="right">
					<a href=""><img src="../../assets/images/facebook.jpg"></a>&nbsp;&nbsp;
					<a href=""><img src="../../assets/images/twitter.jpg"></a>
				</p>
				<p align="right">
					<a href="">
						<font>
							<font>版权所有©花茄2014</font>
						</font>
					</a>
				</p>
				<p align="right">
					<a href="http://www.huaqie.com">
						<font>
							<font>由花茄提供技术支持</font>
						</font>
					</a>
				</p>
			</div>
			<div style="float:right; margin:35px 10px 0 0;">
				<a href="http://online.gov.vn/HomePage/CustomWebsiteDisplay.aspx?DocId=10227"><img src="../../assets/images/Bo_Cong_Thuong.png"></a>
			</div>

		</div>
	</div>
</template>

<script>
	export default {
		name: 'siteFooter',
		data() {
			return {
				footer: '',
			};
		},
	};
</script>

<style scoped>
	.text-center {
		text-align: center;
	}
	
	.footer {
		margin-top: 50px;
	}
	
	.footer .page-container {
		padding: 20px 0px;
	}
	
	.footer a {
		color: #fff;
		text-decoration: none;
	}
</style>