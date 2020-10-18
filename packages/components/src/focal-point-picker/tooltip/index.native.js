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
} from 'react-native';

/**
 * WordPress dependencies
 */
import { useEffect, useRef, useState, useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import styles from './style.scss';

export const TooltipContext = React.createContext();

function Tooltip( { children, value } ) {
	return (
		<TooltipContext.Provider value={ value }>
			{ children }
		</TooltipContext.Provider>
	);
}

function Overlay( { children } ) {
	const { onTooltipHidden, visible } = useContext( TooltipContext );

	return (
		<>
			{ children }
			{ visible && (
				<TouchableWithoutFeedback
					onPress={ () => onTooltipHidden( false ) }
				>
					<View style={ styles.overlay } />
				</TouchableWithoutFeedback>
			) }
		</>
	);
}

function Label( { align, text, xOffset, yOffset } ) {
	const animationValue = useRef( new Animated.Value( 0 ) ).current;
	const [ dimensions, setDimensions ] = useState( null );
	const { onTooltipHidden, visible } = useContext( TooltipContext );

	if ( typeof visible === 'undefined' ) {
		throw new Error(
			'Tooltip.Label cannot be rendered outside of the Tooltip component'
		);
	}

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
		} ).start();
	};

	// Transforms rely upon onLayout to enable custom offsets additions
	let tooltipTransforms;
	if ( dimensions ) {
		tooltipTransforms = [
			{
				translateX:
					( align === 'center' ? -dimensions.width / 2 : 0 ) +
					xOffset,
			},
			{ translateY: -dimensions.height + yOffset },
		];
	}

	const tooltipStyles = [
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
		align === 'left' && styles.tooltipLeftAlign,
	];
	const arrowStyles = [
		styles.arrow,
		align === 'left' && styles.arrowLeftAlign,
	];

	return (
		<Animated.View
			style={ {
				opacity: animationValue,
				transform: [
					{
						translateY: animationValue.interpolate( {
							inputRange: [ 0, 1 ],
							outputRange: [ visible ? 4 : -8, -8 ],
						} ),
					},
				],
			} }
		>
			<TouchableWithoutFeedback
				onPress={ () => onTooltipHidden( false ) }
			>
				<View
					onLayout={ ( { nativeEvent } ) => {
						const { height, width } = nativeEvent.layout;
						setDimensions( { height, width } );
					} }
					style={ tooltipStyles }
				>
					<Text style={ styles.text }>{ text }</Text>
					<View style={ arrowStyles } />
				</View>
			</TouchableWithoutFeedback>
		</Animated.View>
	);
}

Label.defaultProps = {
	align: 'center',
	xOffset: 0,
	yOffset: 0,
};

Tooltip.Overlay = Overlay;
Tooltip.Label = Label;

export default Tooltip;
