import React, { useState } from 'react'

export default function Listing() {
  const [files,setFiles] = useState([]);
  const [formData,setFormData] = useState({
    imageUrls : []
  })
  console.log(formData)
  const [ImageUploadError,setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false)
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
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-center font-semibold text-3xl my-7'>Create a Listing</h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
            <input type="text" placeholder="Name" className='border p-3 rounded-lg' id = 'name' maxLength='62' minLength='10' required/>
            <textarea type="text" placeholder="Description" className='border p-3 rounded-lg' id = 'description' maxLength='62' minLength='10' required/>
            <input type="text" placeholder="Address" className='border p-3 rounded-lg' id = 'address'  required/>
        
            <div className='flex gap-6 flex-wrap'>
              <div className='flex gap-2'>
                <input type = "checkbox" id = "sale" className = "w-5"/>
                <span>Sell</span>
              </div>
            
              <div className='flex gap-2'>
                <input type = "checkbox" id = "rent" className = "w-5"/>
                <span>Rent</span>
              </div>
            
            
              <div className='flex gap-2'>
                <input type = "checkbox" id = "parking" className = "w-5"/>
                <span>Parking Spot</span>
              </div>
            
            
              <div className='flex gap-2'>
                <input type = "checkbox" id = "furnished" className = "w-5"/>
                <span>Furnished</span>
              </div>
            
            
              <div className='flex gap-2'>
                <input type = "checkbox" id = "offer" className = "w-5"/>
                <span>Offer</span>
              </div>
            </div>
            <div className='flex flex-wrap gap-6'>
              <div className='flex items-center gap-2'>
                 <input className = 'p-3 border border-gray-300 rounded-lg' type='number' id = 'bedrooms' min = '1' max = '10'/>
                 <p>Beds</p>
              </div>
              <div className='flex items-center gap-2'>
                 <input className = 'p-3 border border-gray-300 rounded-lg' type='number' id = 'bathrooms' min = '1' max = '10'/>
                 <p>Baths</p>
              </div>
              <div className='flex items-center gap-2'>
                 <input className = 'p-3 border border-gray-300 rounded-lg' type='number' id = 'regularPrice' min = '1' max = '10'/>
                 <div className='flex flex-col items-center'>
                 <p>Regular Price</p>
                 <span className='text-xs'>($ / month)</span>
                 </div>
              </div>
              <div className='flex items-center gap-2'>
                 <input className = 'p-3 border border-gray-300 rounded-lg' type='number' id = 'discountPrice' min = '1' max = '10'/>
                 <div className='flex flex-col items-center'>
                 <p>Discounted Price</p>
                 <span className='text-xs'>($ / month)</span>
                 </div>
              </div>
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
              <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:shadow-lg disabled:opacity-80'>Create Listing</button>
            </div>
            </form>
    </main>
  )
}
