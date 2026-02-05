// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IAerodromeRouter
 * @notice Interface for Aerodrome DEX Router on Base
 */
interface IAerodromeRouter {
    struct Route {
        address from;
        address to;
        bool stable;
        address factory;
    }

    function factory() external view returns (address);
    function defaultFactory() external view returns (address);
    function voter() external view returns (address);
    function weth() external view returns (address);

    function sortTokens(address tokenA, address tokenB) external pure returns (address token0, address token1);

    function poolFor(
        address tokenA,
        address tokenB,
        bool stable,
        address _factory
    ) external view returns (address pool);

    function getAmountsOut(
        uint256 amountIn,
        Route[] memory routes
    ) external view returns (uint256[] memory amounts);

    function quoteAddLiquidity(
        address tokenA,
        address tokenB,
        bool stable,
        address _factory,
        uint256 amountADesired,
        uint256 amountBDesired
    ) external view returns (uint256 amountA, uint256 amountB, uint256 liquidity);

    function quoteRemoveLiquidity(
        address tokenA,
        address tokenB,
        bool stable,
        address _factory,
        uint256 liquidity
    ) external view returns (uint256 amountA, uint256 amountB);

    function addLiquidity(
        address tokenA,
        address tokenB,
        bool stable,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity);

    function removeLiquidity(
        address tokenA,
        address tokenB,
        bool stable,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB);

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        Route[] calldata routes,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        Route[] calldata routes,
        address to,
        uint256 deadline
    ) external;
}

/**
 * @title IAerodromePool
 * @notice Interface for Aerodrome LP Pool
 */
interface IAerodromePool {
    function token0() external view returns (address);
    function token1() external view returns (address);
    function stable() external view returns (bool);
    function factory() external view returns (address);
    function getReserves() external view returns (uint256 reserve0, uint256 reserve1, uint256 blockTimestampLast);
    function totalSupply() external view returns (uint256);
}
