import PropTypes from 'prop-types';

/**
 * EmbedSizeIcon ~
*/
export default function EmbedSizeIcon({ fillColor = '#e0e0e0', height, width }) {
  return (
    <svg width={width} height={height}>
      <rect
        width={width}
        height={height}
        style={{ fill: fillColor, strokeWidth: 1, stroke: '#000000' }}
      />
    </svg>
  );
}

EmbedSizeIcon.propTypes = {
  fillColor: PropTypes.string,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};
