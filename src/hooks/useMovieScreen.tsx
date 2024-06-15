import React, {useRef, useState, } from 'react'
import { Alert, Share } from 'react-native'
import { addFavorite, removeFavorite } from '../services/favorites'
import { FullMovie2 } from '../types'

export default function useMovieScreen (movie : FullMovie2) {
    const [selectedItem, setSelectedItem] = useState<string>('Sinópsis')
    const [showTrailer, setShowTrailer] = useState<boolean>(false)
    const actualTrailerNumber = useRef<number>(0)
    const [trailerId, setTrailerId] = useState<string | undefined>(movie.trailer[actualTrailerNumber.current])
    const [isFavorite, setIsFavorite] = useState<boolean>(false)

    //* SHARE
    const handleShare = async () => {
        try{
            //const currentURL = await Linking.getInitialURL()
            //if(currentURL){
            await Share.share({
                message: `*Movie Finder*\nMira esta película: \n${movie.trailer[0]}\n *${movie.title}* \n*Sinópsis:* ${movie.plot}`
            })            
        }catch(error){
            console.log('Error Sharing: ', error)
        }
    }

    //* SINOPSIS - CAST - DETAILS
    const handleSelectedItem = (item: string) => {
        setSelectedItem(item)
    }

    //* TRAILER VIDEOS
    const handleTrailer = () => {        
        if(movie.trailer.length > 0){
            setShowTrailer(true)
            console.log('showtrailer? ',showTrailer)
        }
        else {
            Alert.alert('No hay trailers disponibles')
        }
    }

    //* inrementa indice para pasar al siguiente trailer
    const handleNextVideo = () => {        
        actualTrailerNumber.current = actualTrailerNumber.current + 1
        if(actualTrailerNumber.current === movie.trailer.length){
            actualTrailerNumber.current = 0
        }        
        setTrailerId(movie.trailer[actualTrailerNumber.current])        
    }

    //* FAVORITES ----> ADD - REMOVE - GET ALL
    const handleFavorite = async() => {
        try{            
            const response = await addFavorite(movie._id, movie.images.posters[0])
            if (response.status === 201) {
                Alert.alert('Se agregó la película a la lista de favoritos')
                setIsFavorite(true)
            } else if (response.status === 409) {
                const responseRemove = await removeFavorite(movie._id)
                if (responseRemove.status === 200){
                    Alert.alert('Se eliminó la película de la lista de favoritos')
                    setIsFavorite(false)
                }
            }             
        }catch{
            Alert.alert('Ocurrió un error al actualizar la lista de favoritos')
        }
    }

    return {
        selectedItem,
        isFavorite,
        setIsFavorite,
        showTrailer,
        setShowTrailer,
        trailerId,
        handleShare,
        handleSelectedItem,
        handleTrailer,
        handleNextVideo,
        handleFavorite,
    }
}