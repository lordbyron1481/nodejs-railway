$('#post-comment').hide();
$('#btn-toggle-comment').click(e=>{
    e.preventDefault();
    $('#post-comment').slideToggle();
});



$('#btn-like').click(function(e){
    e.preventDefault();
    let imgid=$(this).data('id');
    $.post('/images/' +imgid + '/like')
        .done(data=> {
            console.log(data);
            $('.likes-counts').text(data.likes);
            document.getElementById('btn-like').disabled=true;
        });
});

$('#btn-delete').click(function(e){
    e.preventDefault();
    let $this=$(this);
    const response=confirm('Estas seguro de eliminar esta foto?');
    if(response){
        let imgid=$this.data('id');
        $.ajax({
            url:  '/images/' + imgid,
            type: 'DELETE'
        })
        .done(function(result){
            $this.removeClass('btn-danger').addClass('btn-success');
            $this.find('i').removeClass('fa-times').addClass('fa-check');
            document.getElementById('btn-delete').innerText="Foto borrada con exito";
            
            //$this.append('<span>Imagen Borrada</span>');
        });

        
    }
});






