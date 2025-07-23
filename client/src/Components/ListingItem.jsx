import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'

export default function ListingItem({listing}) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg rounded-lg transition-shadow overflow-hidden w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`}>
        <img className='h-[350px] sm:h-[220px] w-full hover:scale-105 transiton-scale duration-300 object-cover' src={listing.imageUrls[0] || "https://www.google.com/url?sa=i&url=https%3A%2F%2Fmarkdmartin.com%2Fbuying-real-estate-why-invest-in-brazil%2F&psig=AOvVaw3fE5qX2EWPuL4iUCzBVEzY&ust=1753370845956000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJjegoam044DFQAAAAAdAAAAABAE"} alt="listing cover"/>
        <div className='p-3 flex flex-col gap-2 w-full'>
            <p className='truncate font-semibold text-lg text-slate-700'>{listing.name}</p>
            <div className='flex items-center gap-1'>
                <MdLocationOn className= 'h-4 w-4 text-green-700'/>
                <p className='text-sm text-gray-600 truncate w-full'>{listing.address}</p>
            </div>
            <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
            <p className='text-slate-500 font-semibold'>${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && '/month'}
            </p>
            <div className='flex text-slate-700 gap-4'>
                <div className='text-xs font-bold'>
                    {listing.bedrooms > 1 ?  `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                </div>
                <div className='text-xs font-bold'>
                    {listing.bathrooms > 1 ?  `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                </div>
            </div>
        </div>
      </Link>
    </div>
  )
}
