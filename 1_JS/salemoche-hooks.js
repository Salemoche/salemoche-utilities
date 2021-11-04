import { useEffect, useState, useRef } from 'react';
import DeviceDetector from "device-detector-js";
import theme from '../styles/theme';

export const useDeviceDetector = () => {

    const [returnDevice, setReturnDevice] = useState({})

    const setDevice = (e = null) => {
        const deviceDetector = new DeviceDetector();
        const userAgent = window.navigator.userAgent;
        const device = deviceDetector.parse(userAgent);

        const width = window.innerWidth;
        const height = window.innerHeight;

        let size;
        let mode;

        switch (true) {
            case width > theme.breakpointXL:
                size = 'extra-large'
                mode = 'desktop'
                break;
            case width > theme.breakpointL:
                size = 'large'
                mode = 'desktop'
                break;
            case width > theme.breakpointM:
                size = 'medium'
                mode = 'desktop'
                break;
            case width > theme.breakpointS:
                size = 'small'
                mode = 'mobile'
                break;
            case width > theme.breakpointXS:
                size = 'extra-small'
                mode = 'mobile'
                break;
            default:
                break;
        }

        setReturnDevice({
            device: device?.device,
            size,
            mode,
            type: device?.device?.type,
            browser: device?.client?.name,
            width,
            height
        })
    }

    useEffect(() => {

        window?.addEventListener( 'resize', setDevice)

        setDevice();

        return () => {
            window?.removeEventListener( 'resize', setDevice)
        }
    }, [])

    // console.log('The Device Detector Hook detected device is:', returnDevice )

    return returnDevice
}

export const useScroll = (ref, callback ) => {

    const scrollData = useRef({
        fromTop: -1,
        fromBottom: -1,
    })

    const scrollFunctions = () => {
        callback({
                fromTop: ref?.current?.scrollTop,
                fromBottom: ref?.current?.scrollHeight - ref?.current?.scrollTop - window.innerHeight,
            });
        // console.log( ref.current.scrollTop, ref.current.scrollHeight - ref.current.scrollTop - window.innerHeight );
        // console.log( scrollData );
    }

    // SM-Todo

    useEffect(() => {
        if ( !ref ) return
        if ( ref.current ) {
            ref.current.addEventListener('scroll', scrollFunctions);
        }

        return () => {
            if ( ref.current ) {
                ref.current.removeEventListener('scroll', scrollFunctions);
            }
        }
	}, [ref, scrollData])

    return scrollData
}

export const useMousePositionOnScreen = ( callback ) => {
    let mousePosition = useRef({});

    useEffect(() => {

        document?.querySelector('html')?.addEventListener('mousemove', handleMouseMove);

        return () => {
            document?.querySelector('html')?.removeEventListener('mousemove', handleMouseMove);
        }
	}, [ ])

    const handleMouseMove = (e, object = null) => {

        const xPos = e.pageX;
        const yPos = e.pageY;
        const objectXPos = object?.offsetLeft - object?.offsetWidth / 2 || window.innerWidth / 2 // SM-Check
        const objectYPos = object?.offsetTop - object?.offsetHeight / 2 || window.innerHeight / 2 // SM-Check

        const getDistanceFrom = () => {
            
            // Search the furthest Edge from Object
            const distanceObjectToEdges = [
                Math.hypot(objectXPos - 0, objectYPos - 0 ),
                Math.hypot(objectXPos - window.innerWidth, objectYPos - 0 ),
                Math.hypot(objectXPos - window.innerWidth, objectYPos - window.innerHeight ),
                Math.hypot(objectXPos - 0, objectYPos - window.innerHeight ),
            ]
            const distanceObjectToFurthestEdge = +Math.max(...distanceObjectToEdges).toFixed(2);
            const distanceFrom = Math.hypot(objectXPos - xPos, objectYPos - yPos );

            return {
                absolute: +distanceFrom.toFixed(2),
                relative: +Math.abs(distanceFrom / distanceObjectToFurthestEdge).toFixed(2),
            }
        }

        // setReturnObject({
        //     xPos,
        //     yPos,
        //     distanceFromObject: getDistanceFrom(),
        // })

        mousePosition = {
            xPos,
            yPos,
            distanceFromObject: getDistanceFrom(),
        };

        callback( mousePosition );
    }
}