/**
 * External dependencies
 */
import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useContext, useState } from '@wordpress/element';
import { BottomSheetContext, FocalPointPicker } from '@wordpress/components';

/**
 * Internal dependencies
 */
import NavigationHeader from '../bottom-sheet/navigation-header';

const FocalPointSettingsMemo = React.memo(
	( {
		focalPoint,
		listProps,
		onFocalPointChange,
		onHandleClosingBottomSheet,
		shouldEnableBottomSheetMaxHeight,
		shouldEnableBottomSheetScroll,
		url,
	} ) => {
		useEffect( () => {
			shouldEnableBottomSheetMaxHeight( false );
			onHandleClosingBottomSheet( null );
		}, [] );
		const navigation = useNavigation();

		function onButtonPress( action ) {
			navigation.goBack();
			onHandleClosingBottomSheet( null );
			shouldEnableBottomSheetMaxHeight( true );
			if ( action === 'apply' ) {
				onFocalPointChange( draftFocalPoint );
			}
		}
		const [ draftFocalPoint, setDraftFocalPoint ] = useState( focalPoint );

		return (
			<SafeAreaView style={ { height: '100%' } }>
				<ScrollView { ...listProps }>
					<NavigationHeader
						screen={ __( 'Edit focal point' ) }
						leftButtonOnPress={ () => onButtonPress( 'cancel' ) }
						applyButtonOnPress={ () => onButtonPress( 'apply' ) }
						isFullscreen
					/>
					<FocalPointPicker
						focalPoint={ draftFocalPoint }
						onChange={ setDraftFocalPoint }
						shouldEnableBottomSheetScroll={
							shouldEnableBottomSheetScroll
						}
						url={ url }
					/>
				</ScrollView>
			</SafeAreaView>
		);
	}
);

function FocalPointSettings( props ) {
	const route = useRoute();
	const {
		listProps,
		onHandleClosingBottomSheet,
		shouldEnableBottomSheetMaxHeight,
		shouldEnableBottomSheetScroll,
	} = useContext( BottomSheetContext );

	return (
		<FocalPointSettingsMemo
			listProps={ listProps }
			onHandleClosingBottomSheet={ onHandleClosingBottomSheet }
			shouldEnableBottomSheetScroll={ shouldEnableBottomSheetScroll }
			shouldEnableBottomSheetMaxHeight={
				shouldEnableBottomSheetMaxHeight
			}
			{ ...props }
			{ ...route.params }
		/>
	);
}

export default FocalPointSettings;
