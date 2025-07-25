import { useEffect } from 'react';
import { useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");
    useEffect(() => {
        const fetchLandLord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data)
            }
            catch (error) {
                console.log(error)
            }
        }
        fetchLandLord();
    }, [listing.userRef])
    const handleChange = (e) => {
        setMessage(e.target.value);
    }
    return (
        <>
            {landlord && (
                <div className='flex flex-col gap-2'>
                    <p>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
                    <textarea name="message" value={message} id="message" rows="2" onChange={handleChange} placeholder='Enter your message here...' className='w-full border p-3 rounded-lg'></textarea>
                    <Link
                        className='bg-slate-700 text-white p-3 text-center rounded-lg hover:opacity-95 uppercase'
                        to={`mailto:${landlord.email}?subject=${encodeURIComponent(`Regarding ${listing.name}`)}&body=${encodeURIComponent(message)}`}
                    >
                        Send Message
                    </Link>
                </div>
            )}
        </>
    )
}
