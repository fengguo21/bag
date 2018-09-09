<template>
	<section>
		<el-tabs v-model="activeName">
	    	<el-tab-pane label="设备" name="first">
	    	<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters">
						<el-form-item>
							<el-input v-model="filters.name" placeholder="设备编号"></el-input>
						</el-form-item>
						<el-form-item>
							<el-input v-model="filters.phone" placeholder="代理商手机号"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="getDevLists">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button  @click="handleAdd">新增设备</el-button>
						</el-form-item>
						<el-form-item>
							<el-button  @click="handleAddBatch">批量新增设备</el-button>
						</el-form-item>
					</el-form>
				</el-col>

			<!--列表-->
				<el-table :data="devs" highlight-current-row v-loading="listLoading" style="width: 100%;" @selection-change="handleSelectionChange" @expand="expand">
					<el-table-column
				      type="selection"
				      width="40">
				    </el-table-column>
					<el-table-column type="expand" style='overflow: hidden'>
				      <template scope="props">
				        <div class="server-wrap">
				        	<p style='margin-top: 0;'>服务价格</p>
				        	<price-list :prices='props.row.basic.price'></price-list>
				        </div>
				        <div class="port-wrap">
				        	<p style='margin-top: 0;'>端口使用状况</p>
				        	<div class='price-list__wrap' v-loading="queryPortLoading">
			        			<div class="price-table">
			        				<span>端口号</span>
			        				<span>端口状态</span>
			        			</div>
			        			<div  v-if="queryPortLoaded"  class="price-list price-table" v-for='(item, key) in props.row.portStatus'>
			        				<span>{{key}}</span>
			        				<span :class='{"success":item=="空闲", "error":item=="正在使用"}'>{{item}}</span>
			        			</div>
			        			<div v-if="!queryPortLoaded"> 设备未联网 </div>
			        		</div>	
				        </div>
				      </template>
				    </el-table-column>
				    <el-table-column type="index" width="60"></el-table-column>
					<el-table-column prop="basic.deviceCode" label="设备编号" width="260" >
					</el-table-column>
					<el-table-column prop="basic.title" label="设备地名" width="200">
					</el-table-column>
					<el-table-column prop="basic.address" label="设备地址" >
						<template scope="scope">
							<div style='cursor: pointer' @click='goNewPage(scope.row)'>{{scope.row.basic.address}}</div>
						</template>
					</el-table-column>
					<el-table-column prop='extra.agent' label="代理商" width='220'>	
						<template scope="scope">
							{{scope.row.extra.agent|filterAgentName}}, {{scope.row.extra.agent|filterAgentPhone}}
							<!-- <div style='cursor: pointer'>{{scope.row.extra.agent.basic.name}}，{{scope.row.extra.agent.basic.phone}}</div> -->
						</template>
					</el-table-column>
					<el-table-column label="操作" width="250">
						<template scope="scope">
							<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button size="small" type='info' @click="handleControl(scope.$index, scope.row)">分配代理商</el-button>
							<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>

			<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-button v-if="agentLevel!=3" @click="delSelect" type='primary' style="float:left;">批量分配设备</el-button>
					<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
					</el-pagination>
				</el-col>
			</el-tab-pane>
		</el-tabs>

		<!--新增设备弹窗-->
		<el-dialog title="新增设备" v-model="addFormVisible" :close-on-click-modal="false" @close='closeAdd'>
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题">
					<el-input v-model="addForm.title" class='small-el-input' auto-complete="off" placeholder='请输入标题'></el-input>
				</el-form-item>
				
				<el-form-item label="设备编号" prop='devCode'>
					<el-input type="text" v-model="addForm.devCode" class='small-el-input' placeholder='请输入设备编号'></el-input>
				</el-form-item>
				
				<el-form-item label="服务价格">
					<el-button size='small' type='info' @click='addPrice'>新增服务价格</el-button>
				</el-form-item>
				<div style='margin-bottom: 10px;'>
					<el-table :data="addForm.price" style="width: 100%;">
						<el-table-column prop="chargeTime" label="充电时长(分钟)" sortable></el-table-column>
						<el-table-column prop="cost" label="成本价格(元)" sortable></el-table-column>
						<el-table-column prop="payFee" label="价格(元)" sortable></el-table-column>
						<el-table-column label="操作" width="100">
							<template scope="scope">
								<el-button type="danger" size="small" @click="delPrice(scope.$index, scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				
				<el-form-item label="设备坐标" prop='position'>
					<el-input type="text" class='small-el-input' v-model="addForm.position" placeholder='请输入设备坐标'></el-input>
				</el-form-item>

				<el-form-item label="设备地址" prop='address'>
					<el-input type="text" v-model="addForm.address" placeholder='请输入设备地址'></el-input>
				</el-form-item>

			</el-form>
			<p>点击选择坐标和地址</p>
			<el-amap @touchmove.prevent @scroll.prevent vid="amap" :plugin="plugin" :events="events" :zoom="zoom" :center="center" :mapStyle="mapStyle">
          <el-amap-marker v-for="(marker, index) in markers" :key="index" :icon="marker.icon" :position="marker.position" :events="marker.events" style="width:48px"></el-amap-marker>
        </el-amap>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancelAdd">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑设备弹窗-->
		<el-dialog title="编辑设备" v-model="editFormVisible" :close-on-click-modal="false" @close='closeAdd'>
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题">
					<el-input v-model="editForm.title" class='small-el-input' auto-complete="off" placeholder='请输入标题'></el-input>
				</el-form-item>
				
				<el-form-item label="设备编号" prop='devCode'>
					<el-input type="text" class='small-el-input' v-model="editForm.devCode" placeholder='请输入设备编号'></el-input>
				</el-form-item>
				
				<el-form-item label="服务价格">
					<el-button size='small' type='info' @click='addPrice'>新增服务价格</el-button>
				</el-form-item>
				<div style='margin-bottom: 10px;'>
					<el-table :data="editForm.price" style="width: 100%;">
						<el-table-column prop="chargeTime" label="充电时长(分钟)" sortable></el-table-column>
						<el-table-column prop="cost" label="成本价格(元)" sortable></el-table-column>
						<el-table-column prop="payFee" label="服务价格(元)" sortable></el-table-column>
						<el-table-column label="操作" width="100">
							<template scope="scope">
								<el-button type="danger" size="small" @click="delPrice(scope.$index, scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				
				<el-form-item label="设备坐标" prop='position'>
					<el-input type="text" class='small-el-input' v-model="editForm.position" placeholder='请输入设备坐标'></el-input>
				</el-form-item>

				<el-form-item label="设备地址" prop='address'>
					<el-input type="text" v-model="editForm.address" placeholder='请输入设备地址'></el-input>
				</el-form-item>

				<p>点击选择坐标和地址</p>

			</el-form>
			<el-amap @touchmove.prevent @scroll.prevent vid="amap2" :plugin="plugin" :events="events" :zoom="zoom" :center="center" :mapStyle="mapStyle">
          <el-amap-marker v-for="(marker, index) in markers" :key="index" :icon="marker.icon" :position="marker.position" :events="marker.events" style="width:48px"></el-amap-marker>
        </el-amap>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancelEdit">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!-- 小窗口，新增价格 -->
		<el-dialog title="新增服务价格" v-model="addPriceVisible" :close-on-click-modal="false" @close='closeAddPrice' size='tiny'>
			<el-form :model="addPriceFrom" label-width="120px" :rules="addPriceRules" ref="addPriceFrom">
				<el-form-item label="充电时长(分钟)" prop='chargeTime'>
					<el-input v-model="addPriceFrom.chargeTime" auto-complete="off" placeholder='请输入充电时长' size='small'></el-input>
				</el-form-item>
				<el-form-item label="成本价格(元)" prop='cost'>
					<el-input type="text" v-model="addPriceFrom.cost" placeholder='请输入成本价格' size='small'></el-input>
				</el-form-item>
				<el-form-item label="服务价格(元)" prop='payFee'>
					<el-input type="text" v-model="addPriceFrom.payFee" placeholder='请输入服务价格' size='small'></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancelAddPrice">取消</el-button>
				<el-button type="primary" @click.native="addPriceOk">确定</el-button>
			</div>
		</el-dialog>	
		<!-- 小窗口，分配代理商 -->
		<el-dialog title="分配代理商" v-model="controlFormVisible" @close='initContrl' :close-on-click-modal="false" size='tiny'>
			<el-form label-width="120px">
				<el-form-item label="选择代理商" prop='agent'>
					<el-select v-model="agent" placeholder="请选择代理商">
				      <el-option
					      v-for="item in options"
					      :key="item.basic.name"
					      :label="item.basic.name"
					      :value="item.basic.phone">
				      </el-option>
				    </el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancelContor">取消</el-button>
				<el-button type="primary" @click.native="addContorOk">确定</el-button>
			</div>
		</el-dialog>
		<!-- 显示设备位置 -->
		<el-dialog
		  title="设备位置"
		  :visible.sync="mapVisible"
		>
		  <p>设备地名：{{device.title}}</p>
		  <el-amap @touchmove.prevent @scroll.prevent vid="amap3" :plugin="plugin"  :zoom="zoom" :center="device.position" :mapStyle="mapStyle">
          <el-amap-marker v-for="(marker, index) in device.markers" :key="index" :icon="marker.icon" :position="marker.position" :events="marker.events" style="width:48px"></el-amap-marker>
        </el-amap>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="mapVisible = false">关闭</el-button>
		  </span>
		</el-dialog>
		<!-- 小窗口，上传设备文件 -->
		<el-dialog
		  title="上传批量设备文件"
		  :visible.sync="addBatchFormVisible"
		  size="tiny">
		  <el-upload
			  class="upload-demo"
			  :action="avatarUrl"
			  :multiple="multiple"
			  accept=".xls,.xlsx"
			  :on-success="handleUploadSuccess">
			  <el-button size="small" type="primary">点击上传</el-button>
			  <div slot="tip" class="el-upload__tip">只能上传Excel表格文件，且不超过500kb</div>
			</el-upload>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addBatchFormVisible = false">关闭</el-button>
		    <el-button type="primary" @click.native="uploadSubmit">确定</el-button>
		  </span>
		</el-dialog>	
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getDevList, createNewDev, setAgent, updateDev, removeDev, avatarUrl, createNewDevBatch, getAgentList, setAgentBatch, getCurrentAgent, queryPort } from '../../api/api';
	import moment from 'moment'
	import priceList from '@/components/zbcdz/priceList'
	import VueAmap from 'vue-amap'

	export default {
		components: {
			priceList
		},
		filters: {
			filterAgentName(data) {
				if(data) {
					return data.basic.name
				} else {
					return '未设置'
				}
			},
			filterAgentPhone(data) {
				if(data) {
					return data.basic.phone
				} else {
					return '未设置'
				}
			}
		},
		data() {
			return {
				agentLevel: '',
				multipleSelection: [],
				options: [],
				agent: '',
				activeName: 'first',
				filters: {
					name: '',
					phone: ''
				},
				multiple: false,
				devs: [],
				total: 0,
				page: 1,
				listLoading: true,	
				editOrAdd: '',		
				mapVisible: false,
				addBatchFormVisible: false,
				addBatchPath: '',
				avatarUrl: avatarUrl,
				queryPortLoading: false,
				queryPortLoaded: false,
				device: {},	
				// 增加新设备
				addForm: {
					title: '',
					devCode: '',
					position: '',
					address: '',
					desc: '',
					price: []
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					devCode: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					position: [
						{ required: true, message: '请输入设备坐标', trigger: 'blur' }
					],
					address: [
						{ required: true, message: '请输入设备地址', trigger: 'blur' }
					]
				},
				addPriceVisible: false,	
				addPriceFrom: {
					chargeTime: '',
					cost: '',
					payFee: ''
				},
				addPriceRules: {
					chargeTime: [
						{ required: true, message: '请输入充电时长', trigger: 'blur' }
					],
					cost: [
						{ required: true, message: '请输入成本价格', trigger: 'blur' }
					],
					payFee: [
						{ required: true, message: '请输入服务价格', trigger: 'blur' }
					]
				},
				// 编辑新设备
				editForm: {
					title: '',
					devCode: '',
					position: '',
					address: '',
					desc: '',
					price: []
				},
				editFormVisible: false,//新增界面是否显示
				editFormRules: {
					devCode: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					position: [
						{ required: true, message: '请输入设备坐标', trigger: 'blur' }
					],
					address: [
						{ required: true, message: '请输入设备地址', trigger: 'blur' }
					]
				},
				controlFormVisible: false,
				controlForm: {
					productId: '',
					phone: ''
				},
				zoom: 16,
            	mapStyle: 'normal',
		      center: [104.065837,30.657349],
		      markers: [
		        {
		                    icon: 'https://dn-huaqie.qbox.me/start_center_point.svg',
		          position: [104.065837,30.657349],
		          productId: '',
		          events: {
		            click: () => {
		              // 我位置的定位
		              
		            }
		          }
		        }
		      ]	,
		      plugin: [{
	            pName: 'ToolBar',
	            events: {
	              init(instance) {
	                console.log(instance);
	              }
	            }
	          }],
		      events: {
		      	'click': (e) => {
		      		
		      		const geocoder = new AMap.Geocoder({
		      			radius: 1000,
		      			extensions: 'all'
		      		})

		      		geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], (status, result) => {
			            if (status === 'complete' && result.info === 'OK') {
			            	if(!this.addForm.address)
			                	this.addForm.address = result.regeocode.formattedAddress
			                if(!this.editForm.address)
			                	this.editForm.address = result.regeocode.formattedAddress
			            }
			        });   
			      
		      		this.center = [e.lnglat.lng, e.lnglat.lat]
		      		this.markers[0].position = this.center
		      		this.addForm.position = `${e.lnglat.lat},${e.lnglat.lng}`
		      		this.editForm.position = `${e.lnglat.lat},${e.lnglat.lng}`
		      	}
		      }		
			}
		},
		computed: {
			level() {
				return this.store.get('user').role.level
			}
		},
		watch: {
			'editForm.address': {
				handler: function(cur, old) {
					console.log('watch..', cur)
					const geocoder = new AMap.Geocoder({
		      			radius: 1000,
		      			extensions: 'all'
		      		})
		      		geocoder.getLocation(cur, (status, result) => {
		      			if(!result || !result.geocodes || !result.geocodes.length)
		      				return
		      			
		      			this.center = [result.geocodes[0].location.lng, result.geocodes[0].location.lat]
			      		this.markers[0].position = this.center
			      		this.editForm.position = `${result.geocodes[0].location.lat},${result.geocodes[0].location.lng}`
		      		})
				},
				deep: true
			},
			'addForm.address': {
				handler: function(cur, old) {
					console.log('watch..', cur)
					const geocoder = new AMap.Geocoder({
		      			radius: 1000,
		      			extensions: 'all'
		      		})
		      		geocoder.getLocation(cur, (status, result) => {
		      			if(!result || !result.geocodes || !result.geocodes.length)
		      				return
		      			
		      			this.center = [result.geocodes[0].location.lng, result.geocodes[0].location.lat]
			      		this.markers[0].position = this.center
			      		this.addForm.position = `${result.geocodes[0].location.lat},${result.geocodes[0].location.lng}`
		      		})
				},
				deep: true
			}
		},
		methods: {
			expand(row, expanded) {
				if(!expanded)
					return
				if(!row.basic || !row.basic.deviceCode){
					this.$message.warning('该设备没有设备号')
					return
				}
				this.queryPortLoading = true
				this.queryPortLoaded = false
				row.portStatus = []
		      	queryPort({
		      		deviceCode: row.basic.deviceCode
		      	}).then( res => {
		      		this.queryPortLoading = false
		      		if(res.code){
		      			this.$message.error(res.message)
		      			return
		      		}
		      		this.queryPortLoaded = true
					let arr = {};
					for(var i = 1; i <= res.data.port_size; i++) {
						arr[i] = (res.data.port.indexOf(i) != -1)?'正在使用':'空闲'
					}
					row.portStatus = arr
		      	})
			},
			// 图片上传成功钩子
			handleUploadSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				console.log(res.data.url)
				this.addBatchPath = res.data.url
			},
			//获取代理商列表
			getAgent() {
				let para = {
					page: 1,
					size: 100
				};
				//NProgress.start();
				getAgentList(para).then((res) => {
					// console.log(res);
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					// console.log(res);
					this.options = res.data.list;
					//NProgress.done();
				});
			},
			// 获取设备列表
			getDevLists() {
				getDevList({
					deviceCode: this.filters.name,
					phone: this.filters.phone,
					page: this.page,
					size: 10
				}).then((res) => {
					if(res.code === 0) {
						// console.log('dev', res.data.list);
						this.listLoading = false;
						this.total = res.data.total;
						// console.log(res);
						res.data.list.forEach(item => {
							let arr = {};
							for(var i = 1; i < 11; i++) {
								arr[i] = '空闲'
							}
							for(var key in item.basic.ports) {
								arr[key] = item.basic.ports[key] == 0? '空闲':'正在使用'
							}
							item.portStatus = arr
						})
						// console.log('newList', res.data.list);
						this.devs = res.data.list;
						// console.log(arr);
					} else {
						this.$message({
							type: 'error',
							message: res.message
						})
					}
				})
			},
			// 分页
			handleCurrentChange(val) {
				this.page = val;
				this.getDevLists();
			},
			// 页面跳转设备位置
			goNewPage(row) {
				this.mapVisible = true
				this.device = {
					position: [row.basic.position[1], row.basic.position[0]],
					title: row.basic.title,
					markers: [
				        {
				          icon: 'https://dn-huaqie.qbox.me/start_center_point.svg',
				          position: [row.basic.position[1], row.basic.position[0]],
				          productId: '',
				          events: {
				            click: () => {
				              // 我位置的定位
				              
				            }
				          }
				        }
				      ]
				}
				//window.open("http://map.qq.com/?type=marker&isopeninfowin=1&markertype=1&pointx="+row.basic.position[1]+"&pointy="+row.basic.position[0]+"&name=充电站&addr="+row.basic.address+"&ref=myapp");
			},
			// 增加设备
			handleAdd() {
				this.editOrAdd = 'add';
				this.addFormVisible = true;
			},
			// 批量增加设备
			handleAddBatch() {
				this.addBatchFormVisible = true;
			},
			// 取消增加
			cancelAdd() {
				this.addFormVisible = false;
			},
			// 确认增加
			addSubmit() {
				let cast = this.addForm;
				let posi = cast.position === ''? ['', '']:cast.position.split(','); 
				let px = posi[0];
				let py = posi[1];
				let para = {
					title: cast.title,
					deviceCode: cast.devCode,
					desc: '',
					position: [px, py],
					address: cast.address,
					price: cast.price
				}
				// console.log(para)
				this.addLoading = true;
				createNewDev(para).then(res => {
					// console.log(res);
					if(res.code === 0) {
						this.$message({
							type: 'success',
							message: '添加成功'
						})
						this.getDevLists();
						this.cancelAdd();
						this.addLoading = false;
					} else {
						this.$message({
							type: 'error',
							message: res.message
						})
					}
				})
			},
			closeAdd() {
				this.addForm = {
					title: '',
					devCode: '',
					position: '',
					address: '',
					desc: '',
					price: []
				}
			},
			// 编辑设备
			handleEdit(index, row) {
				// console.log(index, row);
				this.editOrAdd = 'edit';
				this.editFormVisible = true;
				let oldData = {
					productId: row.productId,
					title: row.basic.title,
					devCode: row.basic.deviceCode,
					price: row.basic.price,
					position: row.basic.position[0]+','+row.basic.position[1],
					address: row.basic.address
				}
				this.editForm = JSON.parse(JSON.stringify(oldData));
			},
			// 取消编辑
			cancelEdit() {
				this.editFormVisible = false;
			},
			// 确认修改
			editSubmit() {
				let cast = this.editForm;
				// console.log(cast);
				let posi = cast.position === ''? ['', '']:cast.position.split(','); 
				let px = posi[0];
				let py = posi[1];
				let para = {
					productId: cast.productId,
					title: cast.title,
					deviceCode: cast.devCode,
					desc: '',
					position: [px, py],
					address: cast.address,
					price: cast.price
				}
				// console.log(para)
				this.addLoading = true;
				updateDev(para).then(res => {
					// console.log(res);
					if(res.code === 0) {
						this.$message({
							type: 'success',
							message: '修改成功'
						})
						this.getDevLists();
						this.cancelEdit();
						this.addLoading = false;
					} else {
						this.$message({
							type: 'error',
							message: res.message
						})
					}
				})
			},
			// 分配代理商
			handleControl(index, row) {
				this.controlFormVisible = true;
				this.controlForm.productId = row.productId;
				// console.log(index, row);
			},
			cancelContor() {
				this.controlFormVisible = false;
			},
			addContorOk() {
				if(this.agent||this.multipleSelection.length>0) {
					if(this.multipleSelection.length>0) {
						this.changeSelect();
					} else {
						this.changeOne();
					}
				} else {
					this.$message.error({
						message: '请选择代理商'
					})
				}
				// console.log(this.controlForm);
			},
			changeOne() {
				this.controlForm.phone = this.agent;
				setAgent(this.controlForm).then(res => {
					// console.log(res);
					if(res.code === 0) {
						this.$message.success({
							message: '设置成功'
						})
						this.cancelContor();
						this.getDevLists();
					} else {
						this.$message.error({
							message: res.message
						})
					}
				})
			},
			changeSelect() {
				let para = {
					products: [],
					phone: this.agent
				};
				this.multipleSelection.forEach(item => {
					para.products.push(item.productId);
				})
				setAgentBatch(para).then(res => {
					if(res.code > 0) {
						this.$message.error({
							message: res.message
						})
					}
					this.$message.success({
						message: '设置成功'
					})
					console.log(res);
					this.cancelContor();
					this.getDevLists();
					this.$refs.multipleTable.clearSelection();
				})
			},
			initContrl() {
				this.controlForm = {
					productId: '',
					phone: ''
				}
			},
			// 删除价格
			delPrice(index, row) {
				if(this.editOrAdd == 'add') {
					let key = this.addForm.price.indexOf(row);
					// console.log(this.addForm.price.indexOf(row));
					this.addForm.price.splice(key, 1);
				} else if(this.editOrAdd == 'edit') {
					let key = this.editForm.price.indexOf(row);
					this.editForm.price.splice(key, 1);
				}				
			},
			// 新增价格
			addPrice() {
				this.addPriceVisible = true;
			},
			cancelAddPrice() {
				this.addPriceVisible = false;
			},
			addPriceOk() {
				this.$refs['addPriceFrom'].validate(valid => {
					if (valid) {
						if(this.editOrAdd == 'add') {
							this.addForm.price.push(this.addPriceFrom);
						} else if(this.editOrAdd == 'edit') {
							this.editForm.price.push(this.addPriceFrom);
						}
						this.cancelAddPrice();
					} else {
						this.$message.error('信息不能为空');
						return false;
					}
				})
			},
			closeAddPrice() {
				this.addPriceFrom = {
					chargeTime: '',
					cost: '',
					payFee: ''
				}
			},
			// 删除设备
			handleDel(index, row) {
				this.$confirm(`确定要删除设备：${row.basic.title} 吗?`, '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          this.delDev(row);
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
			},
			delDev(row) {
				// console.log(row);
				removeDev({
					productId: row.productId
				}).then(res => {
					// console.log(res);
					if(res.code === 0) {
						this.$message({
						  type: 'success',
						  message: '删除成功!'
						});
						this.getDevLists();
					} else {
						this.$message({
						  type: 'error',
						  message: res.message
						});
					}
					// console.log(res);
				})
				// console.log(index, row);
			},
			uploadSubmit() {
				this.addBatchFormVisible = false
				createNewDevBatch({
					path: this.addBatchPath
				}).then( res => {
					if(res.code){
						this.$message({
						  type: 'error',
						  message: res.message
						});
						return
					}
					this.$message({
						  type: 'success',
						  message: '新增设备数量：'+res.data.length
						});
					this.getDevLists()
				})
			},
			// 批量移库
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		    },
		    delSelect() {
		    	this.controlFormVisible = true;
		    	// console.log(this.multipleSelection);
		    },
		},
		mounted() {
			this.getDevLists();
			this.getAgent();
			getCurrentAgent({
				peopleId: this.store.get('user').peopleId
			}).then(res => {
				if(res && res.data)
					this.agentLevel = res.data.extra.level
			})
		}
	}

</script>

<style scoped lang='scss'>
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
  .el-vue-amap-container{
  	height: 500px;
  }
  .server-wrap, .port-wrap {
  	float: left;
  }
  .port-wrap {
  	margin-left: 40px;
  }
  .price-list__wrap {
  	width: 100%;
  	.price-table {
  		width: auto;
  		overflow:hidden;
  		&:first-child {
  			span {
  				border-top: 1px solid #999;	
  			}
  		}
  		.success {
  			color: #13CE66
  		}
  		.error {
  			color: #FF4949
  		}
  		span {
  			float: left;
  			box-sizing: border-box;
  			min-width: 150px;
  			padding: 5px 10px;
  			height: 30px;	
  			line-height: 19px;	
  			border: 1px solid #999;
  			border-top: 0;
  			&:first-child {
  				border-right: 0
  			}
  		}
  	}
  }
</style>