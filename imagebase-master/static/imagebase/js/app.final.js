var PageData = Backbone.Model.extend({
    url: '/dashboard/data/'
});
var useReplaceState = false;
var ImagebaseRouter = Backbone.Router.extend({

    routes: {
        '': 'viewDashboard',
        'image/:id/': 'viewImage',
        'image/:id/update/': 'updateImage'
    },

    'viewDashboard': function(){
        imagebaseRouter.resetView();
        $('#image-master-container').addClass('medium-12').removeClass('medium-8');
        useReplaceState = false;
    },

    'updateImage': function(id){
        console.log('update image %s:', id);
        var imageData = imageUrls[id],
            imageUpdateUrl = imageData.updateUrl,
            imageUrl = imageData.viewUrl;

        $('#modal').foundation('reveal', 'open', imageUpdateUrl);
        $(document).on('closed', '[data-reveal]', function () {
            imagebaseRouter.navigate(imageUrl, {trigger: true});
        });
        useReplaceState = true;

    },

    'viewImage': function(id){
        var imageData = imageUrls[id],
            imageContentUrl = imageData.contentUrl;
        console.log('load image %s from %s', id, imageContentUrl);
        imagebaseRouter.resetView();
        $('#image-detail-container').load(imageContentUrl, null, function(){
            $('#image-master-container').removeClass('medium-12').addClass('medium-8');
            updatePanelContent(id);
        });
        useReplaceState = true;
    },

    'resetView': function(){
        $(document).off('closed');
        $('#modal').foundation('reveal', 'close');
        $('#image-detail-container').empty();
    }



});

function updatePanelContent(id){
    var $panelContainer = $('.image-panel[data-pk='+id+']');
    console.log('panelContainer:', $panelContainer);
    $panelContainer.load(imageUrls[id].panelUrl, null, function(){
        console.log('updated panel %s', id, this);
        $panelContainer.addClass('updated');
        setTimeout(function(){
            $panelContainer.removeClass('updated');
        }, 1000);
    });
}


var imagebaseRouter = new ImagebaseRouter(),
    pageData = new PageData(),
    imageUrls;

$(function(){


    $('main').on('click', 'a[data-pjax]', function(e){
        e.preventDefault();
        e.stopPropagation();
        console.log('useReplaceState:', useReplaceState);
        console.log('e.currentTarget:', e.currentTarget);
        imagebaseRouter.navigate(e.currentTarget.pathname, {trigger: true, replace: useReplaceState});
    });

    pageData.fetch({
        success: function(model){
            imageUrls = model.get('images');
            console.log('window.location.pathname:', window.location.pathname);
            if (window.location.pathname === '/'){
                history.replaceState(null, null, '/dashboard/');
            }
            Backbone.history.start({pushState: true, root:'/dashboard/'});
        },
        error: function(e){
            console.log('error:', e);
        }
    });




});

