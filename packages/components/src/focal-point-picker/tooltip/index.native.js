/**
 * External dependencies
 */
import React from 'react';
import {
	Animated,
	Easing,
	Text,
	TouchableWithoutFeedback,
	View,
	Dimensions,
} from 'react-native';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import styles from './style.scss';

const TooltipContext = React.createContext( { visible: true } );

function TooltipOverlay( { children } ) {
	const [ visible, setVisible ] = useState( true );

	const onHide = () => {
		setVisible( false );
	};

	const stylesOverlay = [
		styles.overlay,
		{ height: Dimensions.get( 'window' ).height },
	];

	return (
		<TooltipContext.Provider value={ { visible } }>
			{ children }
			{ visible && (
				<TouchableWithoutFeedback onPress={ onHide }>
					<View style={ stylesOverlay } />
				</TouchableWithoutFeedback>
			) }
		</TooltipContext.Provider>
	);
}

const Tooltip = ( { onTooltipHidden, additionalOffset = { x: 0, y: 0 } } ) => {
	const animationValue = useRef( new Animated.Value( 0 ) ).current;
	const { visible } = useContext( TooltipContext );
	const [ dimensions, setDimensions ] = useState( null );

	useEffect( () => {
		startAnimation();
	}, [ visible ] );

	const startAnimation = () => {
		Animated.timing( animationValue, {
			toValue: visible ? 1 : 0,
			duration: visible ? 300 : 150,
			useNativeDriver: true,
			delay: visible ? 500 : 0,
			easing: Easing.out( Easing.quad ),
		} ).start( () => {
			if ( ! visible && onTooltipHidden ) {
				onTooltipHidden();
			}
		} );
	};

	let tooltipTransforms;
	if ( dimensions ) {
		tooltipTransforms = [
			{ translateX: -dimensions.width / 2 + ( additionalOffset.x || 0 ) },
			{ translateY: -dimensions.height + ( additionalOffset.y || 0 ) },
		];
	}

	return (
		<Animated.View
			style={ {
				opacity: animationValue,
				transform: [
					{
						translateY: animationValue.interpolate( {
							inputRange: [ 0, 1 ],
							outputRange: [ visible ? 0 : -8, 0 ],
						} ),
					},
				],
			} }
		>
			<View
				onLayout={ ( { nativeEvent } ) => {
					const { height, width } = nativeEvent.layout;
					setDimensions( { height, width } );
				} }
				style={ [
					styles.tooltip,
					{
						shadowColor: styles.tooltipShadow.color,
						shadowOffset: {
							width: 0,
							height: 2,
						},
						shadowOpacity: 0.25,
						shadowRadius: 2,
						elevation: 2,
						transform: tooltipTransforms,
					},
				] }
			>
				<Text style={ styles.text } numberOfLines={ 1 }>
					{ __( 'Drag to adjust focal point' ) }
				</Text>
				<View style={ styles.arrow } />
			</View>
		</Animated.View>
	);
};

Tooltip.Overlay = TooltipOverlay;

export default Tooltip;
