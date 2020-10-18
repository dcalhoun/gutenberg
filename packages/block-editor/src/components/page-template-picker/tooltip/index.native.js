/**
 * External dependencies
 */
import { TouchableWithoutFeedback, View, Dimensions } from 'react-native';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import styles from './style.scss';
import {
	default as Tooltip2,
	TooltipContext,
} from '../../../../../components/src/focal-point-picker/tooltip';

// TODO(David): onTooltipHidden is not invoked because animation is now managed
// elsewhere. Need to re-introduce its invocation somewhere.
const Tooltip = ( { onTooltipHidden } ) => {
	const [ visible, setVisible ] = useState( true );

	const onHide = () => {
		setVisible( false );
	};

	const stylesOverlay = [
		styles.overlay,
		{ height: Dimensions.get( 'window' ).height },
	];

	return (
		<>
			<TouchableWithoutFeedback onPress={ onHide }>
				<View style={ stylesOverlay } />
			</TouchableWithoutFeedback>
			<TooltipContext.Provider value={ visible }>
				<Tooltip2.Label
					align="left"
					xOffset={ 12 }
					text={ __( 'Try a starter layout' ) }
				/>
			</TooltipContext.Provider>
		</>
	);
};

export default Tooltip;
