import districts from './ChinaDistrict.json'

const getCityName = ( pinyin, province ) => {
	if(!pinyin)
		return ''
	let name = ''
	districts.forEach( e => {
		e.forEach((ee, k) => {
			if((province && ee == pinyin && !name && e[k-1] == '' && e[k-2] == '' )
				|| (!province && ee == pinyin && !name))
				name = e[1]
		})
	})
	return name
}

export default getCityName