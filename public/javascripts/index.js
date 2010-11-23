window.onload = function() {
  var s = new io.Socket(null, {port: 3000});

  s.connect();
  s.on('message', function(data) {
    if (data['type'] == 'add') {    
      $("#announcements").append(
          '<li id=' + data['id'] +'>' + data['payload'] + '</li>'
      );
    }
    else if (data['type'] == 'delete') {
      var announcement = $('#' + data['id']);
      announcement.slideUp(300, function () {
        announcement.remove();
      });
    }
    else if (data['type'] == 'edit') {
      var announcement = $('#' + data['id']);
      announcement.html(data['payload']);
    }

  });

  //background rendering -- based heavily on http://test.sjeiti.com/jsflowfield4d/
  //stripped out some code and adapted to use jQuery
  var container;
  var particle;
  var camera;
  var scene;
  var renderer;

  var mouseX = 50;
  var mouseY = 50;
 
  var iW = 1000;
  var iParticles = 1000;
  var aParticles = [];
  var fFieldScale = 0.0009;
  var fParticleSpeed = 40;
  PerlinSimplex.noiseDetail(1.5);

  var point = function point() {
      var fSpd,fSpd2;
      var fX,fY,fZ;
      var fVX,fVY,fVZ;
      var fP1,fP2,fP3,fP4;
      var fOff = 0.1;
      var fSx,fSy,fSz;
      var iColor = 0xFFFFFF*Math.random();
      var oParticle = new THREE.Particle(new THREE.ColorFillMaterial(iColor, 0.4));
      oParticle.size = 15 + 20*Math.random();
      var t;
	
      var reset = function reset() {
          fX = 2*iW*(Math.random()-0.5);
          fY = 2*iW*(Math.random()-0.5);
          fZ = 2*iW*(Math.random()-0.5);
          fVX = 0;
          fVY = 0;
          fVZ = 0;
      };
	
      var run = function run(t) {
          fSx = fFieldScale*fX;
          fSy = fFieldScale*fY;
          fSz = fFieldScale*fZ;
          fP1 = PerlinSimplex.noise(t,fSx,fSy,fSz);
          fP2 = PerlinSimplex.noise(t,fSx+fOff,fSy,fSz);
          fP3 = PerlinSimplex.noise(t,fSx,fSy+fOff,fSz);
          fP4 = PerlinSimplex.noise(t,fSx,fSy,fSz+fOff);
          fVX = fParticleSpeed*(fP2-fP1);
          fVY = fParticleSpeed*(fP3-fP1);
          fVZ = fParticleSpeed*(fP4-fP1);
          fX = fX + fVX;
          fY = fY + fVY;
          fZ = fZ + fVZ;
		
          if (fX<-iW||fX>iW||fY<-iW||fY>iW) {
              reset();
          }
		
          oParticle.position.x = fX;
          oParticle.position.y = fY;
          oParticle.position.z = fZ;
          fSpd = getSpeed();
          oParticle.material[0].color.setRGBA(255,255,255,Math.round(500*fSpd/fParticleSpeed));
      };
	
      var getSpeed = function getSpeed() {
          fSpd2 = Math.sqrt(fVX*fVX+fVY*fVY);
          return Math.sqrt(fSpd2*fSpd2+fVZ*fVZ);
      };
	
      var getParticle = function getParticle() {
          return oParticle;
      };
	
      reset();
	
      oParticle.position.x = fX;
      oParticle.position.y = fY;
      oParticle.position.z = fZ;
      oParticle.updateMatrix();
	
      return {
          getX: function getX(){return fX;},
          getY: function getY(){return fY;},
          getZ: function getZ(){return fZ;},
          getPosition: function getPosition(){return oParticle.position;},
          run: run,
          reset: reset,
          getSpeed: getSpeed,
          getParticle: getParticle
      }
  };
 
  init();
  setInterval(loop,40);

  function init() {
      container = $('body').append('<div id="gfx"></div>');
			
      camera = new THREE.Camera(0, 0, 1000);
      camera.focus = 300;
      
      scene = new THREE.Scene();
      renderer = new THREE.CanvasRenderer();
      renderer.setSize(screen.width, screen.height);
      
      for (var i = 0; i < iParticles; i++) {
          var oPoint = point();
          particle = oPoint.getParticle();
          scene.add(particle);
          aParticles.push(oPoint);
      }
      $('#gfx').append(renderer.domElement);
  }
 
  var i,t;
  var aCheck;
  var fCheckScale = 0.3;
  var fCamScale = 0.2;
  var oParticle, oPosition, x,y,z, xyz, w;
  w = 2*iW*fCheckScale;

  function loop() {
      t = new Date().getTime()*0.0001;
      aCheck = [];
      i = iParticles;
      while (--i>=0) {
          oParticle = aParticles[i];
          oPosition = oParticle.getPosition();
          x = Math.round((oPosition.x+iW)*fCheckScale);
          y = Math.round((oPosition.y+iW)*fCheckScale);
          z = Math.round((oPosition.z+iW)*fCheckScale);
          xyz = z*w*w + y*w + x;					
 
          if (aCheck[xyz]) {
              oParticle.reset();
          } else {
              aCheck[xyz] = true;
              oParticle.run(t);
          }
      }
      camera.position.x += ( 5*mouseX - camera.position.x) * fCamScale;
      camera.position.y += (-5*mouseY - camera.position.y) * fCamScale;
      camera.updateMatrix();
      renderer.render(scene, camera);
  }
};



