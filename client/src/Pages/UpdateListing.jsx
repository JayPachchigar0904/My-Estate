import React, { useState,useEffect } from 'react'
import {useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'

export default function UpdateListing() {
  const {currentUser} = useSelector(state => state.user)
  const [files,setFiles] = useState([]);
  const [error, setError] = useState(false);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate()
  const [formData,setFormData] = useState({
    imageUrls : [],
    name:'',
    description:'',
    address:'',
    type:'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  })
  const params = useParams();
  const [ImageUploadError,setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false)
  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if(data.success === false){
        console.log(data.message);
        return;
      }
      setFormData(data);
    };  
    fetchListing();
  },[]);
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => 
        i !== index
      )
    })
  }
  const handleImageSubmit = (e) => {
    if(files.length > 0 && files.length + formData.imageUrls.length < 7){
      setUploading(true);
      setImageUploadError(false)
      const promises = [];
      for(let i=0;i<files.length;i++){
         promises.push(storeImage(files[i]))
      }
      Promise.all(promises).then((urls) => {
        setFormData({...formData,imageUrls:formData.imageUrls.concat(urls)})
        setImageUploadError(false);
        setUploading(false);
      })
      .catch((err) => {
        setImageUploadError('Image upload failed (2 mb max per image)');
        setUploading(false);
      })
    }else{
      setImageUploadError('You can upload only 6 images per listing')
      setUploading(false);
    }
  }
  const storeImage = async (file) => {
    if(!file) return;
    const data = new FormData();
    data.append("file",file)
    data.append("upload_preset", "My-Estate")
    data.append("cloud_name","dati1ti2a")

    const res = await fetch("https://api.cloudinary.com/v1_1/dati1ti2a/image/upload",{
      method : 'POST',
      body : data,
    })
    const uploaded_image = await res.json();
    return uploaded_image.url;
  }
  const handleChange = (e) => {
    if(e.target.id === 'sale' || e.target.id === 'rent'){
      setFormData({
        ...formData,
        type: e.target.id 
      })
    }
    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setFormData({
        ...formData,
        [e.target.id] : e.target.checked
      })
    }
    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
      setFormData({
        ...formData,  
        [e.target.id] : e.target.value 
      }) 
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      if(formData.imageUrls.length < 1) return setError('You must upload atleast one image')
        if(formData.regularPrice < formData.discountPrice ) return setError('Discount price cannot be greater than regular price')
      setLoading(true)
      setError(false)
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method : 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify({
          ...formData,
        userRef : currentUser._id}),
      })
      const data = await res.json()
      setLoading(false)
      if(data.success === false){
         setError(data.message)
      }
      navigate(`/listing/${data._id}`)
    }
    catch(error){
      setError(error.message)
      setLoading(false)
    }
  }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-center font-semibold text-3xl my-7'>Update Listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
            <input type="text" onChange = {handleChange} value={formData.name} placeholder="Name" className='border p-3 rounded-lg' id = 'name' maxLength='62' minLength='10' required/>
            <textarea type="text"  onChange = {handleChange} value={formData.description} placeholder="Description" className='border p-3 rounded-lg' id = 'description' maxLength='62' minLength='10' required/>
            <input type="text"  onChange = {handleChange} value={formData.address} placeholder="Address" className='border p-3 rounded-lg' id = 'address'  required/>
        
            <div className='flex gap-6 flex-wrap'>
              <div className='flex gap-2'>
                <input onChange={handleChange} type = "checkbox" id = "sale" className = "w-5" checked={formData.type === 'sale'}/>
                <span>Sell</span>
              </div>
            
              <div className='flex gap-2'>
                <input onChange={handleChange} type = "checkbox" id = "rent" className = "w-5" checked={formData.type === 'rent'}/>
                <span>Rent</span>
              </div>
            
            
              <div className='flex gap-2'>
                <input onChange={handleChange} type = "checkbox" id = "parking" className = "w-5" checked={formData.parking}/>
                <span>Parking Spot</span>
              </div>
            
            
              <div className='flex gap-2'>
                <input type = "checkbox" id = "furnished" className = "w-5" onChange={handleChange} checked={formData.furnished}/>
                <span>Furnished</span>
              </div>
            
            
              <div className='flex gap-2'>
                <input type = "checkbox" id = "offer" className = "w-5" onChange={handleChange} checked={formData.offer}/>
                <span>Offer</span>
              </div>
            </div>
            <div className='flex flex-wrap gap-6'>
              <div className='flex items-center gap-2'>
                 <input onChange={handleChange} value={formData.bedrooms} className = 'p-3 border border-gray-300 rounded-lg' type='number' id = 'bedrooms' min = '1' max = '10'/>
                 <p>Beds</p>
              </div>
              <div className='flex items-center gap-2'>
                 <input onChange={handleChange} value={formData.bathrooms} className = 'p-3 border border-gray-300 rounded-lg' type='number' id = 'bathrooms' min = '1' max = '10'/>
                 <p>Baths</p>
              </div>
              <div className='flex items-center gap-2'>
                 <input onChange={handleChange} value={formData.regularPrice} className = 'p-3 border border-gray-300 rounded-lg' type='number' id = 'regularPrice' min = '50' max = '10000000'/>
                 <div className='flex flex-col items-center'>
                 <p>Regular Price</p>
                 <span className='text-xs'>($ / month)</span>
                 </div>
              </div>
              {
                formData.offer && (
                  <div className='flex items-center gap-2'>
                 <input onChange={handleChange} value={formData.discountPrice} className = 'p-3 border border-gray-300 rounded-lg' type='number' id = 'discountPrice' min = '0' max = '10000000'/>
                 <div className='flex flex-col items-center'>
                 <p>Discounted Price</p>
                 <span className='text-xs'>($ / month)</span>
                 </div>
              </div>
                )
              }
            </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
              <p>Images:<span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span></p>
              <div className='flex gap-4'>
                <input className='p-3 border border-gray-300 rounded w-full' onChange = {(e) => setFiles(e.target.files)} type = 'file' id = 'images' accept='image/*' multiple/>
                <button onClick = {handleImageSubmit} disabled = {uploading} type = 'button' className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
                {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              <p className='text-red-700 text-sm'>{ImageUploadError && ImageUploadError}</p>
              {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                <div key = {url} className='flex justify-between p-3 border items-center'>
                <img src={url} alt = "listing image" className='w-20 h-20 object-contain roundedflex-lg'/>
                <button type = 'button' onClick = {() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                </div>
              ))}
              <button disabled = {loading || uploading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:shadow-lg disabled:opacity-80'>{loading ? 'Updating...' : 'Update Listing'}</button>
              {error && <p className='text-red-700 text-sm'>{error}</p>}
            </div>
            </form>
    </main>
  )
}
