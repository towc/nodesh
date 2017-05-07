(function(){
  const els = {
    content: document.querySelector( '.js-content' ),
    input: document.querySelector( '.js-input' ),
    caret: document.querySelector( '.js-caret' )
  }

  console._log = console.log;
  console.log = function() {
    const result = Array.prototype.join.call( arguments, ', ' );
    els.content.textContent += result;
    console._log( result );
  }

  function getPS() {
    return window.introString.replace( 'wd', window.workingDirectory );
  }

  window.workingDirectory = __dirname;
  window.introString = 'user@os:wd$ ';
  window.inputHistory = [];
  let historyIndex = 0;

  const ctx = document.createElement( 'canvas' ).getContext( '2d' );
  ctx.font = '15px monospace';

  function adjustInputSize() {
    els.input.style.width = ctx.measureText( els.input.value ).width + 12 + 'px';
    els.caret.style.marginLeft = -ctx.measureText( els.input.value.substring( els.input.selectionStart, els.input.value.length ) ).width - 21 + 'px';
  }

  window.addEventListener( 'keydown', () => els.input.focus() );
  els.input.addEventListener( 'keydown', e => {
    
    // enter
    if( e.keyCode === 13 ) {
      const value = els.input.value;
      els.input.value = '';
      els.content.textContent += value;

      window.inputHistory.unshift( value );
      historyIndex = -1;

      console.log('\n');

      try { 
        console.log( eval.bind( window )( value ) );
      } catch( e ) {
        console.log( e );
      }

      if( els.content.textContent[ els.content.textContent.length - 1 ] !== '\n' )
        console.log('\n');
      
      console.log( getPS() );

      e.preventDefault();

    // up
    } else if( e.keyCode === 38 ) {
      if( historyIndex < window.inputHistory.length - 1 )
        ++historyIndex;
      els.input.value = window.inputHistory[ historyIndex ];

    // down
    } else if( e.keyCode === 40 ) {
      if( historyIndex >= 0 ) {
        --historyIndex;
        els.input.value = window.inputHistory[ historyIndex ];
      } else
        els.input.value = '';
    }

    window.setTimeout( () => adjustInputSize(), 4 );
  });
  adjustInputSize();

  window.els = els;

  console.log( getPS() );
})();
