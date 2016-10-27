/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* globals document, console */

import ViewDocument from '/ckeditor5/engine/view/document.js';
import DomEventObserver from '/ckeditor5/engine/view/observer/domeventobserver.js';
import ViewRange from '/ckeditor5/engine/view/range.js';
import { setData } from '/ckeditor5/engine/dev-utils/view.js';

const viewDocument = new ViewDocument();
const domEditable = document.getElementById( 'editor' );
const viewRoot = viewDocument.createRoot( domEditable );
let viewStrong;

// Add mouseup oberver.
viewDocument.addObserver( class extends DomEventObserver {
	get domEventType() {
		return [ 'mousedown', 'mouseup' ];
	}

	onDomEvent( domEvent ) {
		this.fire( domEvent.type, domEvent );
	}
} );

viewDocument.on( 'selectionChange', ( evt, data ) => {
	viewDocument.selection.setTo( data.newSelection );
	viewDocument.render();
} );

viewDocument.on( 'mouseup', ( evt, data ) => {
	if ( data.target == viewStrong ) {
		console.log( 'Making selection around the <strong>.' );

		const range = ViewRange.createOn( viewStrong );
		viewDocument.selection.setRanges( [ range ] );
		viewDocument.selection.setFake( true, { label: 'fake selection over bar' } );

		viewDocument.render();

		data.preventDefault();
	}
} );

viewDocument.selection.on( 'change', () => {
	if ( !viewStrong ) {
		return;
	}

	const firstPos = viewDocument.selection.getFirstPosition();
	const lastPos = viewDocument.selection.getLastPosition();

	if ( firstPos && lastPos && firstPos.nodeAfter == viewStrong && lastPos.nodeBefore == viewStrong ) {
		viewStrong.setStyle( 'background-color', 'yellow' );
	} else {
		viewStrong.removeStyle( 'background-color' );
	}
} );

viewDocument.on( 'focus', () => {
	console.log( 'The document was focused.' );
} );

viewDocument.on( 'blur', () => {
	console.log( 'The document was blurred.' );
} );

setData( viewDocument, '<container:p>{}foo<strong contenteditable="false">bar</strong>baz</container:p>' );
const viewP = viewRoot.getChild( 0 );
viewStrong = viewP.getChild( 1 );

viewDocument.focus();
