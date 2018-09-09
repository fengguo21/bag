<template>
	<section>
	
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
			<el-form-item>
					<el-input v-model="filters.customId" placeholder="会员号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.kuaidiNo" placeholder="快递号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.company" clearable placeholder="快递公司">
					    <el-option
					      v-for="item in companies"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.receiveCompany" placeholder="提货公司"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker
				      v-model="filters.receiveDate"
				      type="date"
				      placeholder="提货日期">
				    </el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-date-picker
				      v-model="filters.shipDate"
				      type="date"
				      placeholder="发货日期">
				    </el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.step" clearable placeholder="单状态">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button  @click="handleAdd">新增快递单</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="warning" @click="handleBatchUpdate">批量发货</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="products" highlight-current-row v-loading="listLoading" style="width: 100%;">
			
			<el-table-column type="index" width="60">
			</el-table-column>

			<el-table-column type="expand">
      <template scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
        <div>
          <el-form-item label="当前状态">
            <el-tag v-if="props.row.basic.step == 1" type="primary" >待发货</el-tag>
            <el-tag v-if="props.row.basic.step == 2" type="warning" >已发货</el-tag>
            <el-tag v-if="props.row.basic.step == 3" type="success" >已提货</el-tag>
          </el-form-item>
          <el-form-item label="会员号">
            <span>{{ props.row.basic.customId }}</span>
          </el-form-item>
          <el-form-item label="会员名称">
            <span>{{ props.row.basic.customName }}</span>
          </el-form-item>
          </div>
          <div>
          <el-form-item label="快递公司">
            <span>{{ props.row.basic.company }}</span>
          </el-form-item>
          <el-form-item label="快递单号">
            <span>{{ props.row.basic.kuaidiNo }}</span>
          </el-form-item>
          <el-form-item label="备注物流公司" class="el-form-item-half">
            <span>{{ props.row.basic.oCompany }}</span>
          </el-form-item>
          <el-form-item label="货物件数" class="el-form-item-half">
            <span>{{ props.row.basic.amount }}</span>
          </el-form-item>
          </div>
          <div>
          <el-form-item label="发货人姓名">
            <span>{{ props.row.basic.senderName }}</span>
          </el-form-item>
          <el-form-item label="发货人电话">
            <span>{{ props.row.basic.senderPhone }}</span>
          </el-form-item>
          <el-form-item label="发货地址">
            <span>{{ props.row.basic.senderAddress }}</span>
          </el-form-item>
          </div>
          <div>
          <el-form-item label="收货人姓名">
            <span>{{ props.row.basic.receiverName }}</span>
          </el-form-item>
          <el-form-item label="收货人电话">
            <span>{{ props.row.basic.receiverPhone }}</span>
          </el-form-item>
          <el-form-item label="收货地址">
            <span>{{ props.row.basic.receiverAddress }}</span>
          </el-form-item>
          </div>
          <div>
          <el-form-item label="初发货日期">
            <span>{{ props.row.basic.shipDate }}</span>
          </el-form-item>
          <el-form-item label="货物种类">
            <span>{{ props.row.basic.catalogs }}</span>
          </el-form-item>
          <el-form-item label="重量(KG)" class="el-form-item-half">
            <span>{{ props.row.basic.weight }}</span>
          </el-form-item>
          <el-form-item label="代付运费(元)" class="el-form-item-half">
            <span>{{ props.row.basic.fee }}</span>
          </el-form-item>
          </div>
          <div>
          <el-form-item label="运输信息" class="el-form-item-big">
            <span>{{ props.row.basic.shipNote }}</span>
          </el-form-item>
          </div>
          <div>
          <el-form-item label="备    注" class="el-form-item-big">
            <span>{{ props.row.basic.note }}</span>
          </el-form-item>
          </div>
          <div>
          <el-form-item label="录单人员" class="el-form-item-double">
            <span>{{ props.row.people.name }}</span>
          </el-form-item>
          <el-form-item label="录入日期">
            <span>{{ moment(props.row.created).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </el-form-item>
          </div>
        </el-form>
      </template>
    </el-table-column>
			
			<el-table-column prop="basic.customId" label="会员号" width="150" >
			</el-table-column>
			<el-table-column prop="basic.kuaidiNo" label="快递号" width="150" >
			</el-table-column>
			<el-table-column prop="basic.company" label="快递公司" width="150" >
			</el-table-column>
			<el-table-column prop="basic.amount" label="货物件数" width="100" >
			</el-table-column>
			<el-table-column prop="basic.catalogs" label="货物种类" width="100" >
			</el-table-column>
			<el-table-column prop="basic.fee" label="代付运费" width="100" >
			</el-table-column>
			<el-table-column prop="basic.weight" label="货物重量" width="100" >
			</el-table-column>
			<el-table-column prop="basic.receiveCompany" label="提货公司" width="150" >
			</el-table-column>
			<el-table-column prop="basic.receiveDate" label="提货日期" width="150" >
			</el-table-column>
			<el-table-column prop="basic.shipDate" label="发货日期" width="150" >
			</el-table-column>
			<el-table-column label="单状态" width="100">
				<template scope="scope">
					<el-tag v-if="scope.row.basic.step == 1" type="primary" >待发货</el-tag>
					<el-tag v-if="scope.row.basic.step == 2" type="warning" >已发货</el-tag>
					<el-tag v-if="scope.row.basic.step == 3" type="success" >已提货</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" min-width="180" >
			</el-table-column>
			
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
					
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
		
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
    
		

		

		<!--新增界面-->
		<el-dialog title="新增快递单" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
			<el-form-item label="会员号" prop="customId">
					<el-input v-model="addForm.customId" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="快递号" prop="kuaidiNo">
					<el-input v-model="addForm.kuaidiNo" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="快递公司" prop="company">
					<el-select v-model="addForm.company" clearable placeholder="快递公司">
					    <el-option
					      v-for="item in companies"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>

				<el-form-item label="货物件数">
					<el-input-number v-model="addForm.amount" debounce="2000" :min="0" :max="100000"></el-input-number>
				</el-form-item>

				<el-form-item label="货物种类">
					<el-input-number v-model="addForm.catalogs" debounce="2000" :min="0" :max="200"></el-input-number>
				</el-form-item>

				<el-form-item label="代付运费">
					<el-input-number v-model="addForm.fee" debounce="2000" :min="0"></el-input-number>
				</el-form-item>

				<el-form-item label="货物重量">
					<el-input-number v-model="addForm.weight" debounce="2000" :min="0"></el-input-number> kg
				</el-form-item>
				
				<el-form-item label="提货公司">
					<el-input v-model="addForm.receiveCompany" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="提货日期">
					<el-date-picker
				      v-model="addForm.receiveDate"
				      type="date"
				      placeholder="选择日期">
				    </el-date-picker>
				</el-form-item>

				<el-form-item label="发货日期">
					<el-date-picker
				      v-model="addForm.shipDate"
				      type="date"
				      placeholder="选择日期">
				    </el-date-picker>
				</el-form-item>

				<el-form-item label="单状态">
					<el-select v-model="addForm.step" placeholder="请选择">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>

				<el-form-item label="发货人姓名">
					<el-input v-model="addForm.senderName" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="发货人手机">
					<el-input v-model="addForm.senderPhone" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="发货人地址">
					<el-input v-model="addForm.senderAddress" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="收货人姓名">
					<el-input v-model="addForm.receiverName" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="收货人手机">
					<el-input v-model="addForm.receiverPhone" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="收货人地址">
					<el-input v-model="addForm.receiverAddress" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="备注物流公司">
					<el-input v-model="addForm.oCompany" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="运输信息">
					<el-input v-model="addForm.shipNote" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="备注">
					<el-input v-model="addForm.note" auto-complete="off"></el-input>
				</el-form-item>
				

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="修改快递单" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="会员号" prop="customId">
					<el-input v-model="editForm.customId" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="快递号" prop="kuaidiNo">
					<el-input v-model="editForm.kuaidiNo" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="快递公司" prop="company">
					<el-select v-model="editForm.company" clearable placeholder="快递公司">
					    <el-option
					      v-for="item in companies"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>

				<el-form-item label="货物件数">
					<el-input-number v-model="editForm.amount" debounce="2000" :min="0" :max="100000"></el-input-number>
				</el-form-item>

				<el-form-item label="货物种类">
					<el-input-number v-model="editForm.catalogs" debounce="2000" :min="0" :max="200"></el-input-number>
				</el-form-item>

				<el-form-item label="代付运费">
					<el-input-number v-model="editForm.fee" debounce="2000"></el-input-number>
				</el-form-item>

				<el-form-item label="货物重量">
					<el-input-number v-model="editForm.weight" debounce="2000"></el-input-number> kg
				</el-form-item>
				
				<el-form-item label="提货公司">
					<el-input v-model="editForm.receiveCompany" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="提货日期">
					<el-date-picker
				      v-model="editForm.receiveDate"
				      type="date"
				      placeholder="选择日期">
				    </el-date-picker>
				</el-form-item>

				<el-form-item label="发货日期">
					<el-date-picker
				      v-model="editForm.shipDate"
				      type="date"
				      placeholder="选择日期">
				    </el-date-picker>
				</el-form-item>

				<el-form-item label="单状态">
					<el-select v-model="editForm.step" placeholder="请选择">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>

				<el-form-item label="发货人姓名">
					<el-input v-model="editForm.senderName" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="发货人手机">
					<el-input v-model="editForm.senderPhone" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="发货人地址">
					<el-input v-model="editForm.senderAddress" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="收货人姓名">
					<el-input v-model="editForm.receiverName" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="收货人手机">
					<el-input v-model="editForm.receiverPhone" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="收货人地址">
					<el-input v-model="editForm.receiverAddress" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="备注物流公司">
					<el-input v-model="editForm.oCompany" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="运输信息">
					<el-input v-model="editForm.shipNote" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="备注">
					<el-input v-model="editForm.note" auto-complete="off"></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--批量修改界面-->
		<el-dialog title="批量发货" v-model="editShipFormVisible" :close-on-click-modal="false">
			<el-form :model="editShipForm" label-width="80px" :rules="editShipFormRules" ref="editShipForm">
				<el-form-item label="发货日期" prop="date">
					 <el-date-picker
				      v-model="editShipForm.date"
				      type="date"
				      placeholder="选择日期"
				      :picker-options="pickerOptions">
				    </el-date-picker>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editShipFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editShipSubmit" :loading="editLoading">发货</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getZtwlKuaidiList, addZtwlKuaidi, editZtwlKuaidi, removeZtwlKuaidi, ztwlBatchShip } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				moment: moment,
				activeName: 'first',
				percentStep: false,
				catalogOptions: [],
				catalogChildrenOptions: [],
				pickerOptions: {
		          shortcuts: [{
		            text: '今天',
		            onClick(picker) {
		              picker.$emit('pick', new Date());
		            }
		          }]},
				options: [{
					label: '待发货',
					value: 1
				},{
					label: '已发货',
					value: 2
				},{
					label: '已提货',
					value: 3
				}],
				companies: [{
				label: 'hxpx 泓熙凭祥公司',
				value: '泓熙凭祥公司'
			},{
				label: 'hxhn 泓熙河内公司',
				value: '泓熙河内公司'
			},{
				label: 'bsht 百世汇通',
				value: '百世汇通'
			},{
				label: 'dbwl 德邦物流',
				value: '德邦物流'
			},{
				label: 'dhl DHL',
				value: 'DHL'
			},{
				label: 'dsf 递四方',
				value: '递四方'
			},{
				label: 'dswl 都市物流',
				value: '都市物流'
			},{
				label: 'fedex FedEx',
				value: 'FedEx'
			},{
				label: 'gtkd 国通快递',
				value: '国通快递'
			},{
				label: 'htkd 汇通快递',
				value: '汇通快递'
			},{
				label: 'jdkd 京东快递',
				value: '京东快递'
			},{
				label: 'kjkd 快捷快递',
				value: '快捷快递'
			},{
				label: 'qfkd 全峰快递',
				value: '全峰快递'
			},{
				label: 'qykd 全一快递',
				value: '全一快递'
			},{
				label: 'rfdkd 如风达快递',
				value: '如风达快递'
			},{
				label: 'sfkd 顺丰快递',
				value: '顺丰快递'
			},{
				label: 'srkd 速尔快递',
				value: '速尔快递'
			},{
				label: 'stkd 申通快递',
				value: '申通快递'
			},{
				label: 'syyg 苏宁易购',
				value: '苏宁易购'
			},{
				label: 'tnt TNT',
				value: 'TNT'
			},{
				label: 'ttkd 天天快递',
				value: '天天快递'
			},{
				label: 'ups UPS',
				value: 'UPS'
			},{
				label: 'ydkd 韵达快递',
				value: '韵达快递'
			},{
				label: 'yskd 优速快递',
				value: '优速快递'
			},{
				label: 'ytkd 圆通快递',
				value: '圆通快递'
			},{
				label: 'yzems 邮政EMS',
				value: '邮政EMS'
			},{
				label: 'zjs 宅急送',
				value: '宅急送'
			},{
				label: 'ztkd 中通快递',
				value: '中通快递'
			},{
				label: 'qtkd 其他快递物流',
				value: '其他快递物流'
			}],
				imageUrl: '',
				imageList: [],
				albumList: [],
				checkList: [],
				filters: {
					customId: '',
					kuaidiNo: '',
					company: '',
					receiveCompany: '',
					receiveDate: '',
					shipDate: '',
					step: ''
				},
				percentages: [{
					count: 0,
					percentage: 0
				}],
				products: [],
				tags: [],
				catalogs: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editShipFormVisible: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					title: [
						{ required: true, message: '请输入快递单名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					customId: '',
					kuaidiNo: '',
					company: '',
					amount: 0,
					catalogs: 0,
					fee: 0,
					weight: 0,
					receiveCompany: '',
					receiveDate: '',
					shipDate: '',
					step: 1,
					senderName: '',
					senderPhone: '',
					senderAddress: '',
					receiverName: '',
					receiverPhone: '',
					receiverAddress: '',
					oCompany: '',
					shipNote: '',
					note: ''
				},

				editShipFormRules: {
					date: [
						{ required: true, message: '请输入发货日期', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editShipForm: {
					date: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					customId: [
						{ required: true, message: '请输入会员号', trigger: 'blur' }
					],
					kuaidiNo: [
						{ required: true, message: '请输入快递号', trigger: 'blur' }
					],
					company: [
						{ required: true, message: '请输入快递公司', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					customId: '',
					kuaidiNo: '',
					company: '',
					amount: 0,
					catalogs: 0,
					fee: 0,
					weight: 0,
					receiveCompany: '',
					receiveDate: '',
					shipDate: '',
					step: 1,
					senderName: '',
					senderPhone: '',
					senderAddress: '',
					receiverName: '',
					receiverPhone: '',
					receiverAddress: '',
					oCompany: '',
					shipNote: '',
					note: ''
				},

				addTagFormVisible: false,//新增界面是否显示
				addTagFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addTagForm: {
					title: '',
					order: 0
				},

				addCatalogFormVisible: false,//新增界面是否显示
				addCatalogFormRules: {
					title: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addCatalogForm: {
					title: '',
					order: 0
				},

				addCatalogChildFormVisible: false,//新增界面是否显示
				addCatalogChildFormRules: {
					title: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addCatalogChildForm: {
					catalogId: '',
					title: '',
					order: 0
				}

			}
		},
		methods: {
			catalogChange(catalog) {
				const t = []
				this.catalogs.forEach(c => {
					if(c.basic.title == catalog){
						c.basic.children.forEach( cc => {
							t.push({
								label: cc.title,
								value: cc.title
							})
						})			
					}
				})
				this.catalogChildrenOptions = t
				this.addForm.childCatalog = ''
			},
			 handleRemove(file, fileList) {
		        this.imageList = fileList
		      },
		      handlePreview(file) {
		        console.log('handlePreview',file);
		      },
		       handleAlbumSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				this.albumList.push({
					name: file.name,
					url: res.data.url//file.response.data.url
				})
				//console.log(res, file)
				//this.imageUrl = 'https://'+file.response.data.url
        		//this.imageUrl = URL.createObjectURL(file.raw);
		      },
		      handleImageSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				this.imageList.push({
					name: file.name,
					url: res.data.url//file.response.data.url
				})
				//console.log(res, file)
				//this.imageUrl = 'https://'+file.response.data.url
        		//this.imageUrl = URL.createObjectURL(file.raw);
		      },

			handleAvatarSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				this.imageUrl = res.data.url
				console.log(this.imageUrl)
        		//this.imageUrl = URL.createObjectURL(file.raw);
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
			//性别显示转换
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm')
			},
			formatChildren: function (row, column) {
				return row.basic.children.map(c => c.title).join(',')
			},
			formatPercent1: function(row, column) {
				if(typeof(row.basic.percent) == 'object')
					return row.basic.percent[0]
				return row.basic.percent
			},
			formatPercent2: function(row, column) {
				if(typeof(row.basic.percent) == 'object')
					return row.basic.percent[1]
				return row.basic.percent
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getKuaidis();
			},
			handleClick(){

			},
			//获取用户列表
			getKuaidis() {
				let para = {
					customId: this.filters.customId,
					kuaidiNo: this.filters.kuaidiNo,
					company: this.filters.company,
					receiveCompany: this.filters.receiveCompany,
					receiveDate: (this.filters.receiveDate)?moment(this.filters.receiveDate).format('YYYY-MM-DD'):'',
					shipDate: (this.filters.shipDate)?moment(this.filters.shipDate).format('YYYY-MM-DD'):'',
					step: this.filters.step,
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getZtwlKuaidiList(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					
					this.total = res.data.total;
					this.products = res.data.list;
					this.listLoading = false;
					console.log(this.products)
					//NProgress.done();
				});
			},

			minusPercentage() {
				this.percentages.pop()
			},

			plusPercentage() {
				this.percentages.push({
					count: 0,
					percentage: 0
				})
			},

			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除快递单：'+row.basic.kuaidiNo+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { feedId: row.feedId };

					removeZtwlKuaidi(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getKuaidis();
					});
				}).catch(() => {

				});
			},
			//删除标签
			handleDelTag: function (index, row) {
				this.$confirm('确认删除标签：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { tagId: row.tagId };

					removeTag(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getTags();
					});
				}).catch(() => {

				});
			},
			//删除分类
			handleDelCatalog: function (index, row) {
				this.$confirm('确认删除分类：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { catalogId: row.catalogId };

					removeCatalog(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCatalogs();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row.basic, {
					feedId: row.feedId
				});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					customId: '',
					kuaidiNo: '',
					company: '',
					amount: 0,
					catalogs: 0,
					fee: 0,
					weight: 0,
					receiveCompany: '',
					receiveDate: '',
					shipDate: '',
					step: 1,
					senderName: '',
					senderPhone: '',
					senderAddress: '',
					receiverName: '',
					receiverPhone: '',
					receiverAddress: '',
					oCompany: '',
					shipNote: '',
					note: ''
				};
				this.imageUrl = ''
				this.images = []
				this.percentages = [{
					count: 0,
					percentage: 0
				}]
			},
			//显示批量更新界面
			handleBatchUpdate: function () {
				this.editShipFormVisible = true;
				this.editShipForm.date = ''
			},
			//显示新增界面
			handleAddCatalog: function () {
				this.addCatalogFormVisible = true;
				this.addCatalogForm = {
					title: '',
					avatar: '',
					children: []
				};
			},
			//显示新增界面
			handleAddCatalogChild: function (index, row) {
				this.addCatalogChildFormVisible = true;
				this.addCatalogChildForm = {
					catalogId: row.catalogId,
					title: '',
					avatar: '',
					order: 0
				};
			},
			//显示新增界面
			handleAddTag: function () {
				this.addTagFormVisible = true;
				this.addTagForm = {
					title: '',
					order: 0
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.receiveDate = (para.receiveDate)?moment(para.receiveDate).format('YYYY-MM-DD'):''
							para.shipDate = (para.shipDate)?moment(para.shipDate).format('YYYY-MM-DD'):''							

							

							editZtwlKuaidi(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.editStockFormVisible = false
								this.getKuaidis();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.receiveDate = (para.receiveDate)?moment(para.receiveDate).format('YYYY-MM-DD'):''
							para.shipDate = (para.shipDate)?moment(para.shipDate).format('YYYY-MM-DD'):''

							

							addZtwlKuaidi(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								if(res.code){
									this.$message({
									message: res.message,
									type: 'error'
								});
									return
								}
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getKuaidis();
							});
						});
					}
				});
			},
			//批量发货
			editShipSubmit: function () {
				this.$confirm('确认批量发货吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.editShipFormVisible = false;
					this.listLoading = true;
					//NProgress.start();
					let para = { date: moment(this.editShipForm.date).format('YYYY-MM-DD') };
					
					ztwlBatchShip(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '批量发货成功',
							type: 'success'
						});
						this.getKuaidis();
					});
				}).catch(() => {

				});
			},
			query() {
				this.page = 1
				this.getKuaidis()
			}
		},
		mounted() {
			this.getKuaidis();
		}
	}

</script>

<style scoped>
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
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 300px;
  }

  .demo-table-expand .el-form-item-half {
    width: 220px;
  }

  .demo-table-expand .el-form-item-big {
    width: 900px;
  }

  .demo-table-expand .el-form-item-double {
    width: 600px;
  }
</style>