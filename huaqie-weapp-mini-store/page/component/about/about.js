
Page({
  data:{
    title: '',
    text: '',
    phone: '',
    address: '',
    company: ''
  },
  onLoad(){
   this.setData({
   	title: '老来青大米',
      text: '“老来青”特色大米产于上海市松江区，种植于黄浦江上游水资源保护区的叶榭和车墩两镇。并已通过无公害产品认证。',
   	phone: '021 - 6774 1995',
   	address: '上海市松江区沪松路25号',
   	company: '上海老来青米业专业合作社'
   })
  }
})