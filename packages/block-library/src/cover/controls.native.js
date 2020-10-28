/**
 * External dependencies
 */
import { View } from 'react-native';
import Video from 'react-native-video';

/**
 * WordPress dependencies
 */
import {
	Image,
	Icon,
	IMAGE_DEFAULT_FOCAL_POINT,
	PanelBody,
	RangeControl,
	BottomSheet,
	ToggleControl,
} from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import { withPreferredColorScheme } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import styles from './style.scss';
import OverlayColorSettings from './overlay-color-settings';
import FocalPointSettings from './focal-point-settings';
import {
	COVER_MIN_HEIGHT,
	COVER_MAX_HEIGHT,
	COVER_DEFAULT_HEIGHT,
	IMAGE_BACKGROUND_TYPE,
	VIDEO_BACKGROUND_TYPE,
} from './shared';

function Controls( {
	attributes,
	didUploadFail,
	getStylesFromColorScheme,
	isUploadInProgress,
	onClearMedia,
	onSelectMedia,
	openMediaOptionsRef,
	setAttributes,
} ) {
	const {
		backgroundColor,
		backgroundType,
		dimRatio,
		hasParallax,
		focalPoint,
		minHeight,
		url,
	} = attributes;
	const CONTAINER_HEIGHT = minHeight || COVER_DEFAULT_HEIGHT;
	const onHeightChange = ( value ) => {
		if ( minHeight || value !== COVER_DEFAULT_HEIGHT ) {
			setAttributes( { minHeight: value } );
		}
	};

	const onOpactiyChange = ( value ) => {
		setAttributes( { dimRatio: value } );
	};

	const [ displayPlaceholder, setDisplayPlaceholder ] = useState( true );

	function setFocalPoint( value ) {
		setAttributes( { focalPoint: value } );
	}

	const toggleParallax = () => {
		setAttributes( {
			hasParallax: ! hasParallax,
			...( ! hasParallax
				? { focalPoint: undefined }
				: { focalPoint: IMAGE_DEFAULT_FOCAL_POINT } ),
		} );
	};

	const addMediaButtonStyle = getStylesFromColorScheme(
		styles.addMediaButton,
		styles.addMediaButtonDark
	);

	function focalPointPosition( { x, y } = IMAGE_DEFAULT_FOCAL_POINT ) {
		return {
			left: `${ ( hasParallax ? 0.5 : x ) * 100 }%`,
			top: `${ ( hasParallax ? 0.5 : y ) * 100 }%`,
		};
	}

	const [ videoNaturalSize, setVideoNaturalSize ] = useState( null );

	const imagePreviewStyles = [
		displayPlaceholder && styles.imagePlaceholder,
	];
	const videoPreviewStyles = [
		{
			aspectRatio:
				videoNaturalSize &&
				videoNaturalSize.width / videoNaturalSize.height,
			height: '100%',
		},
		! displayPlaceholder && styles.video,
		displayPlaceholder && styles.imagePlaceholder,
	];
	return (
		<InspectorControls>
			<OverlayColorSettings
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
			{ url ? (
				<PanelBody>
					<RangeControl
						label={ __( 'Opacity' ) }
						minimumValue={ 0 }
						maximumValue={ 100 }
						value={ dimRatio }
						onChange={ onOpactiyChange }
						style={ styles.rangeCellContainer }
						separatorType={ 'topFullWidth' }
					/>
				</PanelBody>
			) : null }
			<PanelBody title={ __( 'Dimensions' ) }>
				<RangeControl
					label={ __( 'Minimum height in pixels' ) }
					minimumValue={ COVER_MIN_HEIGHT }
					maximumValue={ COVER_MAX_HEIGHT }
					value={ CONTAINER_HEIGHT }
					onChange={ onHeightChange }
					style={ styles.rangeCellContainer }
				/>
			</PanelBody>

			<PanelBody title={ __( 'Media' ) }>
				{ url ? (
					<>
						<BottomSheet.Cell
							style={ backgroundColor }
							cellContainerStyle={ styles.mediaPreview }
						>
							<View style={ styles.mediaInner }>
								{ IMAGE_BACKGROUND_TYPE === backgroundType && (
									<Image
										editButton={ ! displayPlaceholder }
										isSelected={ ! displayPlaceholder }
										isUploadFailed={ didUploadFail }
										isUploadInProgress={
											isUploadInProgress
										}
										onImageDataLoad={ () => {
											setDisplayPlaceholder( false );
										} }
										onSelectMediaUploadOption={
											onSelectMedia
										}
										openMediaOptions={
											openMediaOptionsRef.current
										}
										url={ url }
										height="100%"
										style={ imagePreviewStyles }
										width={ styles.image.width }
									/>
								) }
								{ VIDEO_BACKGROUND_TYPE === backgroundType && (
									<Video
										muted
										paused
										disableFocus
										onLoad={ ( event ) => {
											const {
												height,
												width,
											} = event.naturalSize;
											setVideoNaturalSize( {
												height,
												width,
											} );
											setDisplayPlaceholder( false );
										} }
										resizeMode={ 'cover' }
										source={ { uri: url } }
										style={ videoPreviewStyles }
									/>
								) }
								{ ! hasParallax && ! displayPlaceholder && (
									<Icon
										icon={ plus }
										size={ styles.focalPointHint.width }
										testMe={ true }
										style={ [
											styles.focalPointHint,
											focalPointPosition( focalPoint ),
										] }
									/>
								) }
							</View>
						</BottomSheet.Cell>
						<FocalPointSettings
							focalPoint={
								focalPoint || IMAGE_DEFAULT_FOCAL_POINT
							}
							mediaType={ backgroundType }
							onFocalPointChange={ setFocalPoint }
							url={ url }
						/>
						{ IMAGE_BACKGROUND_TYPE === backgroundType && (
							<ToggleControl
								label={ __( 'Fixed background' ) }
								checked={ hasParallax }
								onChange={ toggleParallax }
							/>
						) }
						<BottomSheet.Cell
							leftAlign
							label={ __( 'Clear Media' ) }
							labelStyle={ styles.clearMediaButton }
							onPress={ onClearMedia }
						/>
					</>
				) : (
					<BottomSheet.Cell
						label={ __( 'Add image or video' ) }
						labelStyle={ addMediaButtonStyle }
						leftAlign
						onPress={ openMediaOptionsRef.current }
					/>
				) }
			</PanelBody>
		</InspectorControls>
	);
}

export default withPreferredColorScheme( Controls );
