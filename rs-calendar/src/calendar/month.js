import React from 'react';

export default class Month extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
        	<section className="month">
	            <div className="month-header">
	            	<div>Mon</div>
	            	<div>Tue</div>
	            	<div>Wed</div>
	            	<div>Thu</div>
	            	<div>Fri</div>
	            	<div>Sat</div>
	            	<div>Sun</div>
	            </div>
	            <div className="month-body">
	            	<div className="month-body-row">
		            	<div>01</div>
		            	<div>02</div>
		            	<div>03</div>
		            	<div>04</div>
		            	<div>05</div>
		            	<div>06</div>
		            	<div>07</div>
		            </div>
		            <div className="month-body-row">
		            	<div>08</div>
		            	<div>09</div>
		            	<div>10</div>
		            	<div>11</div>
		            	<div>12</div>
		            	<div>13</div>
		            	<div>14</div>
		            </div>
		            <div className="month-body-row">
		            	<div>15</div>
		            	<div>16</div>
		            	<div>17</div>
		            	<div>18</div>
		            	<div>19</div>
		            	<div>20</div>
		            	<div>21</div>
		            </div>
		            <div className="month-body-row">
		            	<div>22</div>
		            	<div>23</div>
		            	<div>24</div>
		            	<div>25</div>
		            	<div>26</div>
		            	<div>27</div>
		            	<div>28</div>
		            </div>
		            <div className="month-body-row">
		            	<div>29</div>
		            	<div>30</div>
		            	<div>31</div>
		            	<div>01</div>
		            	<div>02</div>
		            	<div>03</div>
		            	<div>04</div>
		            </div>	
	            </div>
            </section>
        );
    }    
}
