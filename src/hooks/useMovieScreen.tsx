import React, {useEffect, useRef, useState, } from 'react'
import { Alert, Animated, Linking, Share } from 'react-native'
import { addFavorite, removeFavorite } from '../services/favorites'
import { FullMovie2 } from '../types'

export default function useMovieScreen (movie : FullMovie2) {
    const [selectedItem, setSelectedItem] = useState<string>('Sinópsis')
    const [showTrailer, setShowTrailer] = useState<boolean>(false)
    const actualTrailerNumber = useRef<number>(0)
    const [trailerId, setTrailerId] = useState<string | undefined>(movie.trailer[actualTrailerNumber.current])
    const [isFavorite, setIsFavorite] = useState<boolean>(false)
    const rotateValueHolder = useRef(new Animated.Value(0)).current    
    

    //* Effect to reset selectedItem when movie changes
    useEffect(() => {
        setSelectedItem('Sinópsis')
        setTrailerId(movie.trailer[actualTrailerNumber.current])
    }, [movie])

    //* SHARE
    const handleShare = async () => {
        try{
            const currentURL = await Linking.getInitialURL()
            const message = currentURL 
                ? `*Movie Finder*\n\nMirá esta película: \n${currentURL} \n\n*${movie.title}* \n\n*Sinópsis:*\n ${movie.plot}`
                : `*Movie Finder*\n\nMirá esta película: \nhttps://www.youtube.com/watch?v=${movie.trailer[0]}\n\n*${movie.title}* \n\n*Sinópsis:*\n ${movie.plot}`
            console.log('\n---------------->\n\n',currentURL)        
            console.log('\n---------------->\n\n',message)
            await Share.share({
                message: message
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
            if(!isFavorite){
                setIsFavorite(true)
                animateTransition()
            }else{
                setIsFavorite(false)
                animateTransition()
            }
            const response = await addFavorite(movie._id, movie.images.posters[0])
            if (response.status === 201) {
                return
            } else if (response.status === 409) {
                const responseRemove = await removeFavorite(movie._id)
                if (responseRemove.status !== 200){
                    setIsFavorite(true)
                    animateTransition()
                }
            }
        }catch{
            Alert.alert('Ocurrió un error al actualizar la lista de favoritos')
            setIsFavorite(!isFavorite)
            animateTransition()
        }
    }

    const animateTransition = () => {
        Animated.timing(rotateValueHolder, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true
        }).start(() => {
            setIsFavorite(!isFavorite)
            rotateValueHolder.setValue(-1)  // Inicia desde -90 grados
            Animated.timing(rotateValueHolder, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true
            }).start()
        })
    }

    return {
        rotateValueHolder,
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