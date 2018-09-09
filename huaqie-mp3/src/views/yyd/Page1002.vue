<template>
	<section>
		
	    	<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters">
					<el-form-item>
							<el-input v-model="filters.title" placeholder="柜子标题"></el-input>
						</el-form-item>
						<el-form-item>
							<el-input v-model="filters.deviceCode" placeholder="柜子编号"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="getDevLists">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button  @click="handleAdd">新增柜子</el-button>
						</el-form-item>
						<!--<el-form-item>
							<el-button  @click="handleAddBatch">批量新增柜子</el-button>
						</el-form-item>-->
					</el-form>
				</el-col>

			<!--列表-->
				<el-table :data="devs" highlight-current-row v-loading="listLoading" style="width: 100%;" @selection-change="handleSelectionChange">
					<!--<el-table-column
				      type="selection"
				      width="40">
				    </el-table-column>-->
					<el-table-column type="expand" style='overflow: hidden'>
				      <template scope="props">
				        <div class="port-wrap">
				        	<h3>ID: {{props.row.feedId}}</h3>
				        	<p style='margin-top: 0;'>格子使用状况</p>
				        	<div class='price-list__wrap'>
			        			<div class="price-table">
			        				<span>格子编号</span>
			        				<span>器材图标</span>
			        				<span>器材ID</span>
			        				<span>器材名称</span>
			        				<span>器材编号</span>
			        			</div>
			        			<div class="price-list price-table" v-for='(item, key) in props.row.basic.cells'>
			        				<span>{{item.cellNo}}</span>
			        				<span ><img v-if="item.feedId" :src="item.equipment && item.equipment.avatar" class="mini-avatar"/></span>
			        				<span >{{item.feedId}}</span>
			        				<span >{{item.feedId && item.equipment && item.equipment.title}}</span>
			        				<span >{{item.feedId && item.equipment && item.equipment.deviceCode}}</span>
			        			</div>
			        		</div>	
				        </div>
				      </template>
				    </el-table-column>
				    <el-table-column type="index" width="60"></el-table-column>
					<el-table-column prop="basic.title" label="标题" width="200">
					</el-table-column>
					<el-table-column prop="basic.deviceCode" label="编号" width="100" >
					</el-table-column>
					<el-table-column prop="basic.cellSize" label="格子数量" width="100" >
					</el-table-column>
					<el-table-column prop="basic.cellSize" label="器材数量" width="100" :formatter="formatCount" >
					</el-table-column>
					<el-table-column prop="basic.address" label="地址" >
						<template scope="scope">
							<div style='cursor: pointer' @click='goNewPage(scope.row)'>{{scope.row.basic.address}}</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="150">
						<template scope="scope">
							<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>

			<!--工具条-->
				<el-col :span="24" class="toolbar">
					<!--<el-button v-if="agentLevel!=3" @click="delSelect" type='primary' style="float:left;">批量分配柜子</el-button>-->
					<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
					</el-pagination>
				</el-col>
		

		<!--新增柜子弹窗-->
		<el-dialog title="新增柜子" v-model="addFormVisible" :close-on-click-modal="false" @close='closeAdd'>
			<el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题">
					<el-input v-model="addForm.title" class='small-el-input' auto-complete="off" placeholder='请输入标题'></el-input>
				</el-form-item>
				
				<el-form-item label="柜子编号" prop='deviceCode'>
					<el-input type="text" v-model="addForm.deviceCode" class='small-el-input' placeholder='请输入柜子编号'></el-input>
				</el-form-item>

				<el-form-item label="柜子格子数量" prop='cellSize'>
					<el-input-number type="text" v-model="addForm.cellSize" class='small-el-input' placeholder='柜子格子数量' :min="1" :max="100"></el-input-number>
				</el-form-item>
				<!--
				<el-form-item label="存放器材">
					<el-button size='small' type='info' @click='addEquipment'>存入器材</el-button>
				</el-form-item>
				-->
				<div style='margin-bottom: 10px;'>
					<el-table :data="addForm.cells" style="width: 100%;">
						<el-table-column prop="cellNo" label="格子编号"></el-table-column>
						<el-table-column prop="deviceCode" label="器材编号" ></el-table-column>
						<el-table-column prop="title" label="器材名称" ></el-table-column>
						<el-table-column label="操作" width="100">
							<template scope="scope">
							<el-button v-if="scope.row.feedId" type="danger" size="small" @click="delEquipment(scope.$index, scope.row)">取出</el-button>
								<el-button v-else type="success" size="small" @click="addEquipment(scope.$index, scope.row)">存入</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				
				<el-form-item label="柜子坐标" prop='position'>
					<el-input type="text" class='small-el-input' v-model="addForm.position" placeholder='请输入柜子坐标'></el-input>
				</el-form-item>

				<el-form-item label="柜子地址" prop='address'>
					<el-input type="text" v-model="addForm.address" placeholder='请输入柜子地址'></el-input>
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
		<!--编辑柜子弹窗-->
		<el-dialog title="编辑柜子" v-model="editFormVisible" :close-on-click-modal="false" @close='closeAdd'>
			<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题">
					<el-input v-model="editForm.title" class='small-el-input' auto-complete="off" placeholder='请输入标题'></el-input>
				</el-form-item>
				
				<el-form-item label="柜子编号" prop='deviceCode'>
					<el-input type="text" class='small-el-input' v-model="editForm.deviceCode" placeholder='请输入柜子编号'></el-input>
				</el-form-item>
				
				<el-form-item label="柜子格子数量" prop='cellSize'>
					<el-input-number type="text" v-model="editForm.cellSize" class='small-el-input' placeholder='柜子格子数量' :min="1" :max="100"></el-input-number>
				</el-form-item>
				
				<!--
				<el-form-item label="存放器材">
					<el-button size='small' type='info' @click='addEquipment'>存入器材</el-button>
				</el-form-item>
				-->
				<div style='margin-bottom: 10px;'>
					<el-table :data="editForm.cells" style="width: 100%;">
						<el-table-column prop="cellNo" label="格子编号"></el-table-column>
						<el-table-column prop="deviceCode" label="器材编号" ></el-table-column>
						<el-table-column prop="title" label="器材名称" ></el-table-column>
						<el-table-column label="操作" width="100">
							<template scope="scope">
								<el-button v-if="scope.row.feedId" type="danger" size="small" @click="delEquipment(scope.$index, scope.row)">取出</el-button>
								<el-button v-else type="success" size="small" @click="addEquipment(scope.$index, scope.row)">存入</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				
				<el-form-item label="柜子坐标" prop='position'>
					<el-input type="text" class='small-el-input' v-model="editForm.position" placeholder='请输入柜子坐标'></el-input>
				</el-form-item>

				<el-form-item label="柜子地址" prop='address'>
					<el-input type="text" v-model="editForm.address" placeholder='请输入柜子地址'></el-input>
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
		<el-dialog title="存入器材" v-model="addEquipmentVisible" :close-on-click-modal="false" @close='closeAddPrice' size='tiny'>
			<el-form :model="addEquipmentFrom" label-width="120px" :rules="addEquipmentRules" ref="addEquipmentFrom">
				<!--
				<el-form-item label="格子编号" >
					<el-input-number v-model="addEquipmentFrom.cellNo" auto-complete="off" placeholder='请输入格子编号' size='small' :min="1" :max="(editOrAdd == 'add' && addForm.cellSize) || (editOrAdd == 'edit' && editForm.cellSize)"></el-input-number>
				</el-form-item>
				-->
				<el-form-item label="器材编号" prop='deviceCode'>
					<el-input type="text" v-model="addEquipmentFrom.deviceCode" placeholder='请输入器材编号' size='small'></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancelAddPrice">取消</el-button>
				<el-button type="primary" @click.native="addEquipmentOk">确定</el-button>
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
		<!-- 显示柜子位置 -->
		<el-dialog
		  title="柜子位置"
		  :visible.sync="mapVisible"
		>
		  <p>柜子地名：{{device.title}}</p>
		  <el-amap @touchmove.prevent @scroll.prevent vid="amap3" :plugin="plugin"  :zoom="zoom" :center="device.position" :mapStyle="mapStyle">
          <el-amap-marker v-for="(marker, index) in device.markers" :key="index" :icon="marker.icon" :position="marker.position" :events="marker.events" style="width:48px"></el-amap-marker>
        </el-amap>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="mapVisible = false">关闭</el-button>
		  </span>
		</el-dialog>
		<!-- 小窗口，上传柜子文件 -->
		<el-dialog
		  title="上传批量柜子文件"
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
	import { yydFindBoxByState, yydCreateBox, yydUpdateBox, yydRemoveBox, avatarUrl, createNewDevBatch, getAgentList, setAgentBatch, getCurrentAgent, yydFindEquipmentByDeviceCode } from '../../api/api';
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
				editOrAdd: 'add',		
				mapVisible: false,
				addBatchFormVisible: false,
				addBatchPath: '',
				avatarUrl: avatarUrl,
				device: {},	
				// 增加新柜子
				addForm: {
					title: '',
					deviceCode: '',
					position: '',
					address: '',
					desc: '',
					cellSize: 0,
					cells: []
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					deviceCode: [
						{ required: true, message: '请输入柜子编号', trigger: 'blur' }
					],
					position: [
						{ required: true, message: '请输入柜子坐标', trigger: 'blur' }
					],
					address: [
						{ required: true, message: '请输入柜子地址', trigger: 'blur' }
					]
				},
				addEquipmentVisible: false,	
				addEquipmentFrom: {
					cellNo: 0,
					deviceCode: ''
				},
				addEquipmentRules: {
					feedId: [
						{ required: true, message: '请输入器材ID', trigger: 'blur' }
					]
				},
				// 编辑新柜子
				editForm: {
					title: '',
					deviceCode: '',
					position: '',
					address: '',
					desc: '',
					cellSize: 0,
					cells: []
				},
				editFormVisible: false,//新增界面是否显示
				editFormRules: {
					title: [
						{ required: true, message: '请输入柜子标题', trigger: 'blur' }
					],
					position: [
						{ required: true, message: '请输入柜子坐标', trigger: 'blur' }
					],
					address: [
						{ required: true, message: '请输入柜子地址', trigger: 'blur' }
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
			'addForm.cellSize': {
				handler: function(cur, old) {
					console.log('watch..', cur)
					const tmp = []
					for(let i = 1; i <= cur; i++){
						if(this.addForm.cells[i-1])
							tmp.push(this.addForm.cells[i-1])
						else
							tmp.push({
								cellNo: i,
								feedId: ''
							})
					}
					this.addForm.cells = tmp
				},
				deep: true
			},
			'editForm.cellSize': {
				handler: function(cur, old) {
					console.log('watch..', cur)
					const tmp = []
					for(let i = 1; i <= cur; i++){
						if(this.editForm.cells[i-1])
							tmp.push(this.editForm.cells[i-1])
						else
							tmp.push({
								cellNo: i,
								feedId: ''
							})
					}
					this.editForm.cells = tmp
				},
				deep: true
			},
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
			formatCount(row, column) {
				let count = 0
				row.basic.cells.forEach(e => {
					if(e.feedId)
						count += 1
				})
				return count
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
			// 获取柜子列表
			getDevLists() {
				yydFindBoxByState({
					deviceCode: this.filters.deviceCode,
					title: this.filters.title,
					page: this.page,
					size: 10
				}).then((res) => {
					if(res.code === 0) {
						 console.log('dev', res.data.list);
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
			// 页面跳转柜子位置
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
			// 增加柜子
			handleAdd() {
				this.editOrAdd = 'add';
				this.addFormVisible = true;
			},
			// 批量增加柜子
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
				let px = Number(posi[0]);
				let py = Number(posi[1]);
				let para = {
					title: cast.title,
					deviceCode: cast.deviceCode,
					desc: '',
					position: [px, py],
					address: cast.address,
					cells: cast.cells,
					cellSize: cast.cellSize
				}
				const cells = []
				for(let i = 1; i <= cast.cellSize; i++){
					let exist = false
					cast.cells.forEach(e => {
						if(e.cellNo == i){
							cells[i-1] = e
							exist = true 
						}
					})
					if(!exist)
						cells[i-1] = {
							cellNo: i,
							feedId: ''
						}
				}
				para.cells = cells
				this.addLoading = true;
				yydCreateBox(para).then(res => {
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
					deviceCode: '',
					position: '',
					address: '',
					desc: '',
					cellSize: 0,
					cells: []
				}
			},
			// 编辑柜子
			handleEdit(index, row) {
				// console.log(index, row);
				this.editOrAdd = 'edit';
				this.editFormVisible = true;
				let oldData = {
					feedId: row.feedId,
					title: row.basic.title,
					deviceCode: row.basic.deviceCode,
					cellSize: row.basic.cellSize,
					cells: row.basic.cells,
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
				let px = Number(posi[0]);
				let py = Number(posi[1]);
				let para = {
					feedId: cast.feedId,
					title: cast.title,
					deviceCode: cast.deviceCode,
					desc: '',
					position: [px, py],
					address: cast.address,
					cellSize: cast.cellSize,
					cells: cast.cells,
					price: cast.price
				}
				// console.log(para)
				this.addLoading = true;
				yydUpdateBox(para).then(res => {
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
			delEquipment(index, row) {
				if(this.editOrAdd == 'add') {
					let key = this.addForm.cells.indexOf(row);
					// console.log(this.addForm.price.indexOf(row));
					this.addForm.cells.forEach((e, k) => {
						if(key == k){
							e.feedId = ''
							e.deviceCode = ''
							e.title = ''
						}
					})
				} else if(this.editOrAdd == 'edit') {
					let key = this.editForm.cells.indexOf(row);
					this.editForm.cells.forEach((e, k) => {
						if(key == k){
							e.feedId = ''
							e.deviceCode = ''
							e.title = ''
						}
					})
				}				
			},
			// 新增价格
			addEquipment(index) {
				this.addEquipmentVisible = true;
				this.cellIndex = index
			},
			cancelAddPrice() {
				this.addEquipmentVisible = false;
			},
			addEquipmentOk() {
				this.$refs['addEquipmentFrom'].validate(valid => {
					if (valid) {
						yydFindEquipmentByDeviceCode({
							deviceCode: this.addEquipmentFrom.deviceCode
						}).then(data => {
							if(!data.data){
								this.$message.error('没找到器材')
								return
							}else if(data.data.basic.allocate.peopleId || data.data.basic.allocate.boxFeedId){
								this.$message.error('该器材不可存入')
								return
							}

							console.log(data.data)
							

							if(this.editOrAdd == 'add') {
								this.addForm.cells.forEach((e, k) => {
									if(k == this.cellIndex){
										e.feedId = data.data.feedId
										e.deviceCode = data.data.basic.deviceCode
										e.title = data.data.basic.title
									}
								})
							} else if(this.editOrAdd == 'edit') {
								this.editForm.cells.forEach((e, k) => {
									if(k == this.cellIndex){
										e.feedId = data.data.feedId
										e.deviceCode = data.data.basic.deviceCode
										e.title = data.data.basic.title
									}
								})
								//this.editForm.cells.push(this.addEquipmentFrom);
							}
							this.cancelAddPrice();
						})
					} else {
						this.$message.error('信息不能为空');
						return false;
					}
				})
			},
			closeAddPrice() {
				this.addEquipmentFrom = {
					cellNo: 0,
					deviceCode: ''
				}
			},
			// 删除柜子
			handleDel(index, row) {
				this.$confirm(`确定要删除柜子：${row.basic.title} 吗?`, '提示', {
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
				yydRemoveBox({
					feedId: row.feedId
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
						  message: '新增柜子数量：'+res.data.length
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
  			min-width: 250px;
  			padding: 5px 10px;
  			height: 30px;	
  			line-height: 19px;	
  			border: 1px solid #999;
  			border-top: 0;
  			border-left: 0;
  			&:first-child {
  				border-right: 1px solid #999;	
  				border-left: 1px solid #999;	
  			}
  		}
  	}
  }
  .mini-avatar{
  	width: 20px;
  	height: 20px;
  }
</style>