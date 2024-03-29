// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({
	data:{
		movies:{},
		navigateTitle:"",
		requestUrl:"",
		totalCount:0,
		isEmpty:true,
		requsetTotalCount:0
	},
	onLoad:function(options){
		var category=options.category;
		// var category ="正在热映";
		this.data.navigateTitle=category;
		var dataUrl="";
		switch(category)
		{
			case "正在热映":
				dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
				break;
			case "即将上映":
				dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
				break;
			case "豆瓣Top250":
				dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
				break;
		}
		this.data.requestUrl=dataUrl;
		util.http(dataUrl, this.processDoubanData);
	},
	onReady: function () {
		wx.setNavigationBarTitle({
			title: this.data.navigateTitle
		})
	},
	processDoubanData: function (moviesDouban){
		this.setData({
			requsetTotalCount:moviesDouban.total
		});
		var movies = [];
		for (var idx in moviesDouban.subjects) {
			var subject = moviesDouban.subjects[idx];
			var title = subject.title;
			if (title.length >= 6) {
				title = title.substring(0, 6) + "...";
			}
			var temp = {
				stars: util.convertToStarsArray(subject.rating.stars),
				title: title,
				average: subject.rating.average,
				coverageUrl: subject.images.large,
				movieId: subject.id
			}
			movies.push(temp);
		}
		var totalMovies={};
		this.data.totalCount+=20;
		if(!this.data.isEmpty)
		{
			totalMovies=this.data.movies.concat(movies);
		}else{
			totalMovies=movies;
			this.data.isEmpty=false;
		}
		this.setData({
			movies: totalMovies
		});
		this.data.totalCount += 20;
		wx.hideNavigationBarLoading();
		wx.stopPullDownRefresh();
	}, 
	onReachBottom:function(event)
	{
		if(this.data.requsetTotalCount>this.data.totalCount)
		{
			var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
			util.http(nextUrl, this.processDoubanData);
			wx.showNavigationBarLoading();
		}
		else
		{
			wx.showToast({
				title: '没有更多了',
				image:'/images/tab/ciwei_hl.png'
			})
		}
	},
	onPullDownRefresh:function(event){
		var refreshUrl=this.data.requestUrl+"?start=0&count=20";
		this.data.movies={};
		this.data.isEmpty=true;
		this.data.totalCount=0;
		util.http(refreshUrl, this.processDoubanData);
		wx.showNavigationBarLoading();
	},
	onMovieTap: function (event) {
		var movieId = event.currentTarget.dataset.movieid;
		wx.navigateTo({
			url: '/pages/movies/movie-detail/movie-detail?id=' + movieId,
		})
	}
	
})
// /**
// 	 * 页面的初始数据
// 	 */
// data: {

// },

// /**
//  * 生命周期函数--监听页面加载
//  */
// onLoad: function (options) {

// },

// /**
//  * 生命周期函数--监听页面初次渲染完成
//  */
// onReady: function () {

// },

// /**
//  * 生命周期函数--监听页面显示
//  */
// onShow: function () {

// },

// /**
//  * 生命周期函数--监听页面隐藏
//  */
// onHide: function () {

// },

// /**
//  * 生命周期函数--监听页面卸载
//  */
// onUnload: function () {

// },

// /**
//  * 页面相关事件处理函数--监听用户下拉动作
//  */
// onPullDownRefresh: function () {

// },

// /**
//  * 页面上拉触底事件的处理函数
//  */
// onReachBottom: function () {

// },

// /**
//  * 用户点击右上角分享
//  */
// onShareAppMessage: function () {

// }